import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodbClient';
import type { Mensagem } from '@/types/chat.types';
import type { Usuario } from '@/types/user.types';

export async function handleConversationsGet(request: Request) {
    try {
        const db = await getDb();

        // Buscar todos os session_id únicos da coleção mensagens
        const sessionIds = await db.collection<Mensagem>('mensagens').distinct('session_id');

        // Para cada session_id, buscar dados da conversa
        const conversations = await Promise.all(
            sessionIds.map(async (sessionId) => {
                // Buscar a última mensagem da sessão
                const lastMessage = await db
                    .collection<Mensagem>('mensagens')
                    .find({ session_id: sessionId })
                    .sort({ enviada_em: -1 })
                    .limit(1)
                    .toArray();

                if (lastMessage.length === 0) {
                    // Caso não tenha mensagem, ignorar
                    return null;
                }

                const usuarioId = lastMessage[0].usuario_id;

                // Buscar dados do usuário
                const user = await db.collection<Usuario>('users').findOne({ _id: usuarioId });

                return {
                    sessionId,
                    userName: user?.nome || 'Usuário',
                    userPhone: user?.telefone || '',
                    status: user?.status || 'ativo',
                    lastMessage: lastMessage[0].mensagem.content,
                    lastMessageDate: lastMessage[0].enviada_em,
                };
            })
        );

        // Filtrar nulos (caso alguma sessão não tenha mensagens)
        const filteredConversations = conversations.filter((conv) => conv !== null);

        return NextResponse.json(filteredConversations);
    } catch (error) {
        console.error('Erro ao buscar conversas:', error);
        return NextResponse.json({ error: 'Erro ao buscar conversas' }, { status: 500 });
    }
}
