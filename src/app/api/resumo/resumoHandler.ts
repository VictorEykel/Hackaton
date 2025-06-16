// /src/app/api/resumo/resumoHandler.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodbClient';
import { ObjectId } from 'mongodb';
import type { Mensagem, ChatSession } from '@/types/chat.types';
import type { Usuario } from '@/types/user.types';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';

interface ResumoRequestBody {
  sessionId: string;
  usuarioId: string;
}

export async function resumoHandler(request: NextRequest) {
  if (!N8N_WEBHOOK_URL) {
    return NextResponse.json({ error: 'Webhook URL não configurada' }, { status: 500 });
  }

  const body: ResumoRequestBody = await request.json();

  if (!body.sessionId || !body.usuarioId) {
    return NextResponse.json({ error: 'sessionId e usuarioId são obrigatórios' }, { status: 400 });
  }

  const db = await getDb();

  // Converter usuarioId para ObjectId
  let usuarioObjectId: ObjectId;
  try {
    usuarioObjectId = new ObjectId(body.usuarioId);
  } catch {
    return NextResponse.json({ error: 'usuarioId inválido' }, { status: 400 });
  }

  // Buscar mensagens da sessão no banco
  const mensagens: Mensagem[] = await db
    .collection<Mensagem>('mensagens')
    .find({
      session_id: body.sessionId,
      usuario_id: usuarioObjectId,
    })
    .sort({ enviada_em: 1 }) // ordenar cronologicamente
    .toArray();

  if (!mensagens || mensagens.length === 0) {
    return NextResponse.json({ error: 'Nenhuma mensagem encontrada para essa sessão' }, { status: 404 });
  }

  // Buscar dados do usuário
  const usuario: Usuario | null = await db
    .collection<Usuario>('users')
    .findOne({ _id: usuarioObjectId });

  if (!usuario) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  // Criar um resumo simples concatenando as mensagens
  const resumoTexto = mensagens
    .map((msg) => `${msg.mensagem.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.mensagem.content}`)
    .join('\n');

  // Montar payload para o webhook do n8n
  const payload = {
    sessionId: body.sessionId,
    usuario: {
      id: usuario._id?.toString(),
      nome: usuario.nome,
      telefone: usuario.telefone,
      status: usuario.status,
      perfil: usuario.perfil,
    },
    resumo: resumoTexto,
    mensagensCount: mensagens.length,
    mensagens: mensagens.map((msg) => ({
      role: msg.mensagem.role,
      content: msg.mensagem.content,
      enviada_em: msg.enviada_em,
    })),
    timestamp: new Date().toISOString(),
  };

  // Enviar para o webhook do n8n
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erro ao enviar para webhook n8n:', errorText);
    return NextResponse.json({ error: 'Falha ao enviar para o webhook do n8n' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Resumo enviado com sucesso', resumo: payload });
}
