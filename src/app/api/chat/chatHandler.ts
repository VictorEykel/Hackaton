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

        // Buscar histórico ANTES de salvar a mensagem do usuário
        const history: ChatMessage[] = await getConversationHistory(sessionId);

        // Se histórico está vazio, envia mensagem de boas-vindas e salva antes de processar a mensagem do usuário
        if (history.length === 0) {
            const welcomeMessage = `Olá! Eu sou o TravelAI, seu assistente virtual da TravelTech AI. Estou aqui para tornar o planejamento da sua viagem pelo Brasil simples e rápido — seja reservando hotéis, encontrando os melhores voos ou ajudando com qualquer dúvida. Por onde gostaria de começar hoje?`;
            await addMessageToConversation(usuarioId, sessionId, 'assistant', welcomeMessage);
            return new Response(welcomeMessage);
        }

        // Agora salva a mensagem do usuário
        await addMessageToConversation(usuarioId, sessionId, 'user', lastUserMessage.content);

        // Atualiza o histórico incluindo a mensagem do usuário
        const updatedHistory: ChatMessage[] = await getConversationHistory(sessionId);

        const messagesForOpenAI: ChatMessage[] = [
            { role: 'system', content: `Você é o TravelAI, assistente virtual da TravelTech AI, especialista em viagens pelo Brasil.

                                        Seu objetivo é ajudar o cliente a planejar a viagem de forma rápida, prática e amigável, guiando-o passo a passo com perguntas simples e diretas, uma de cada vez.

                                        Seja empático, claro e objetivo, evitando perguntas múltiplas na mesma mensagem para não confundir o usuário.

                                        Sempre confirme a resposta do usuário antes de passar para a próxima etapa.

                                        Se o usuário não souber responder, ofereça opções simples para escolher.

                                        Se não souber a resposta para alguma pergunta, informe educadamente que não possui essa informação.

                                        Exemplo de fluxo ideal:

                                        Usuário: Quero viajar  
                                        Assistente: Ótimo! Para onde você gostaria de ir?  

                                        Usuário: Rio de Janeiro  
                                        Assistente: Qual a data de início da sua viagem?  

                                        Usuário: 10 de julho  
                                        Assistente: Qual a data de término da sua viagem?  

                                        Usuário: 15 de julho  
                                        Assistente: Você prefere hotel, pousada ou Airbnb?  

                                        E assim por diante, sempre uma pergunta por vez, respeitando as respostas do usuário.

                                        Responda sempre de forma clara, objetiva e sem enrolação.
` },
            ...updatedHistory,
        ];

        const response = await streamText({
            model: openaiClient.chat('gpt-4o-mini'),
            messages: messagesForOpenAI,
            temperature: 0.2,
            maxTokens: 400,
            topP: 1,
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


