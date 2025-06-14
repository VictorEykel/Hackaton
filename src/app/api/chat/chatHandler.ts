import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUserBySession, addMessageToConversation, getConversationHistory } from './chatRepository';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { ChatMessage } from './chatRepository';

const openaiClient = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    compatibility: 'strict',
});

async function streamToString(stream: AsyncIterable<any>): Promise<string> {
    const decoder = new TextDecoder();
    let result = '';
    for await (const chunk of stream) {
        result += typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true });
    }
    return result;
}

export async function handleChatGet(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ error: 'sessionId é obrigatório' }, { status: 400 });
        }

        const history = await getConversationHistory(sessionId);
        return NextResponse.json(history);
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}

export async function handleChatPost(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionId, messages } = body;

        if (!sessionId || typeof sessionId !== 'string') {
            return new Response(JSON.stringify({ error: 'sessionId inválido ou ausente' }), { status: 400 });
        }
        if (!Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: 'messages inválido ou ausente' }), { status: 400 });
        }

        const lastUserMessage = messages[messages.length - 1];
        if (lastUserMessage.role !== 'user' || typeof lastUserMessage.content !== 'string') {
            return new Response(JSON.stringify({ error: 'Última mensagem não é do usuário' }), { status: 400 });
        }

        const usuarioId = await getOrCreateUserBySession(sessionId);

        await addMessageToConversation(usuarioId, sessionId, 'user', lastUserMessage.content);

        const history: ChatMessage[] = await getConversationHistory(sessionId);

        const messagesForOpenAI: ChatMessage[] = [
            { role: 'system', content: 'Você é um assistente de viagens amigável e útil, especialista no Brasil.' },
            ...history,
        ];

        const response = await streamText({
            model: openaiClient.chat('gpt-3.5-turbo'),
            messages: messagesForOpenAI,
        });

        (async () => {
            try {
                const text = await streamToString(response.textStream);
                await addMessageToConversation(usuarioId, sessionId, 'assistant', text);
            } catch (e) {
                console.error('Erro ao salvar a mensagem do assistente:', e);
            }
        })();

        return new Response(response.textStream);
    } catch (error) {
        console.error('Erro na API /api/chat:', error);
        return new Response(JSON.stringify({ error: 'Erro interno no servidor' }), { status: 500 });
    }
}
