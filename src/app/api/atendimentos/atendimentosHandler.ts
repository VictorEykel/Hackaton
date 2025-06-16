import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodbClient';
import type { ChatSession, Mensagem } from '@/types/chat.types';
import type { Usuario } from '@/types/user.types';

export async function handleAtendimentosGet(request: Request) {
    try {
        const db = await getDb();

        const sessions = await db.collection<ChatSession>('sessions').find({}).toArray();

        // Para cada sessão, buscar usuário e última mensagem
        const atendimentos = await Promise.all(
            sessions.map(async (session) => {
                const usuario = await db.collection<Usuario>('usuarios').findOne({ _id: session.usuario_id });
                const lastMessage = await db
                    .collection<Mensagem>('mensagens')
                    .find({ session_id: session.sessionId })
                    .sort({ enviada_em: -1 })
                    .limit(1)
                    .toArray();

                return {
                    id: session._id?.toString() || session.sessionId,
                    registerDate: session.createdAt.toISOString(),
                    ticketId: session.sessionId,
                    clientName: usuario?.nome || 'Desconhecido',
                    attendant: 'Bot', 
                    contact: usuario?.telefone || '',
                    tag: lastMessage[0]?.mensagem.content || '',
                    status: usuario?.status || 'ativo',
                };
            })
        );

        return NextResponse.json(atendimentos);
    } catch (error) {
        console.error('Erro ao buscar atendimentos:', error);
        return NextResponse.json({ error: 'Erro ao buscar atendimentos' }, { status: 500 });
    }
}
