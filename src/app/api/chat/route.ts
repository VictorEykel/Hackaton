// backend/api/chat/route.ts

import { NextRequest } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { addMessage, getMessagesBySession, initDB } from '../../../lib/db';

const openaiClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: 'strict',
});

// Defina os tipos literais para o role, conforme esperado pelo SDK
type ChatMessageRole = "user" | "assistant" | "system";

type ChatMessage = {
  role: ChatMessageRole;
  content: string;
};

async function streamToString(stream: AsyncIterable<Uint8Array | string>): Promise<string> {
  const decoder = new TextDecoder();
  let result = '';

  for await (const chunk of stream) {
    if (typeof chunk === 'string') {
      result += chunk;
    } else {
      result += decoder.decode(chunk, { stream: true });
    }
  }
  result += decoder.decode();
  return result;
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const sessionId = body.sessionId;
  const messagesArray = body.messages;

  if (!sessionId || typeof sessionId !== 'string') {
    return new Response(JSON.stringify({ error: 'sessionId inválido ou ausente' }), { status: 400 });
  }

  if (!Array.isArray(messagesArray) || messagesArray.length === 0) {
    return new Response(JSON.stringify({ error: 'messages inválido ou ausente' }), { status: 400 });
  }

  // Pega a última mensagem do usuário enviada pelo frontend
  const lastUserMessage = messagesArray.filter((m: any) => m.role === 'user').slice(-1)[0];

  if (!lastUserMessage || typeof lastUserMessage.content !== 'string') {
    return new Response(JSON.stringify({ error: 'Mensagem do usuário inválida ou ausente' }), { status: 400 });
  }

  const message = lastUserMessage.content;

  await initDB();

  // Salva a última mensagem do usuário
  await addMessage({
    sessionId,
    timestamp: new Date().toISOString(),
    role: 'user',
    content: message,
  });

  // Busca o histórico completo e ordenado
  const history = await getMessagesBySession(sessionId);

  // Mensagem system para definir o comportamento do assistente
  const systemMessage: ChatMessage = {
    role: 'system',
    content: 'Você é um assistente de viagens amigável e útil.',
  };

  // Mapeia o histórico garantindo que role seja do tipo literal esperado
  const messages: ChatMessage[] = [
    systemMessage,
    ...history
      .filter(m => ["user", "assistant", "system"].includes(m.role))
      .map(m => ({
        role: m.role as ChatMessageRole,
        content: m.content,
      })),
  ];

  // Define o modelo
  const model = openaiClient.chat("gpt-3.5-turbo");

  // Chama o streamText com o array de mensagens correto
  const response = await streamText({
    model,
    messages,
  });

  // Converte o stream para texto completo para salvar no banco
  const text = await streamToString(response.textStream);

  // Salva a resposta do assistente
  await addMessage({
    sessionId,
    timestamp: new Date().toISOString(),
    role: 'assistant',
    content: text,
  });

  // Retorna o stream original para o cliente (resposta em tempo real)
  return new Response(response.textStream);
}
