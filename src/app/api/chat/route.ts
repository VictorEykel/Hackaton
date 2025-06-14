// backend/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, type CoreMessage } from 'ai';

// Importa as novas funções de serviço do MongoDB
import {
  getOrCreateUserBySession,
  addMessageToConversation,
  getConversationHistory
} from '../../../lib/chat-service';

// Configuração do cliente OpenAI
const openaiClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: 'strict',
});

// Função auxiliar para converter stream em string
async function streamToString(stream: AsyncIterable<any>): Promise<string> {
  const decoder = new TextDecoder();
  let result = '';
  for await (const chunk of stream) {
    result += typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true });
  }
  return result;
}

// NOVO MÉTODO GET
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId é obrigatório' }, { status: 400 });
    }

    // Busca o histórico usando nossa função de serviço
    const history = await getConversationHistory(sessionId);

    return NextResponse.json(history);

  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, messages: messagesArray } = body;

    // Validações de entrada
    if (!sessionId || typeof sessionId !== 'string') {
      return new Response(JSON.stringify({ error: 'sessionId inválido ou ausente' }), { status: 400 });
    }
    if (!Array.isArray(messagesArray) || messagesArray.length === 0) {
      return new Response(JSON.stringify({ error: 'messages inválido ou ausente' }), { status: 400 });
    }

    // Pega a última mensagem do usuário do array recebido
    const lastUserMessage = messagesArray[messagesArray.length - 1];
    if (lastUserMessage.role !== 'user' || typeof lastUserMessage.content !== 'string') {
      return new Response(JSON.stringify({ error: 'Última mensagem não é do usuário' }), { status: 400 });
    }

    // 1. OBTÉM OU CRIA O USUÁRIO E OBTÉM SEU ID
    const usuarioId = await getOrCreateUserBySession(sessionId);

    // 2. SALVA A MENSAGEM ATUAL DO USUÁRIO NO MONGODB
    await addMessageToConversation(usuarioId, sessionId, 'user', lastUserMessage.content);

    // 3. BUSCA O HISTÓRICO COMPLETO DO MONGODB
    const history = await getConversationHistory(sessionId);

    // 4. PREPARA AS MENSAGENS PARA A API DA OPENAI
    const messages: CoreMessage[] = [
      { role: 'system', content: 'Você é um assistente de viagens amigável e útil, especialista no Brasil.' },
      ...history,
    ];

    // 5. CHAMA A API E OBTÉM A RESPOSTA EM STREAM
    const response = await streamText({
      model: openaiClient.chat("gpt-3.5-turbo"),
      messages,
    });

    // Função para processar o stream em segundo plano (não bloqueia o retorno)
    const processAndSaveChanges = async () => {
      try {
        const text = await streamToString(response.textStream);
        // 6. SALVA A RESPOSTA COMPLETA DO ASSISTENTE NO MONGODB
        await addMessageToConversation(usuarioId, sessionId, 'assistant', text);
      } catch (e) {
        console.error("Erro ao salvar a mensagem do assistente:", e);
      }
    };

    processAndSaveChanges();

    // 7. RETORNA O STREAM DIRETAMENTE PARA O FRONTEND
    return new Response(response.textStream);

  } catch (error) {
    console.error("Erro na API /api/chat:", error);
    return new Response(JSON.stringify({ error: 'Erro interno no servidor' }), { status: 500 });
  }
}