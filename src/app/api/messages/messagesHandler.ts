// src/app/api/messages/messagesHandler.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodbClient';
import type { Mensagem } from '@/types/chat.types';

export async function handleMessagesGet(request: Request) {
    try {
        const url = new URL(request.url);
        const sessionId = url.searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ error: 'Parâmetro sessionId é obrigatório' }, { status: 400 });
        }

        const db = await getDb();

        const messages = await db
            .collection<Mensagem>('mensagens')
            .find({ session_id: sessionId })
            .sort({ enviada_em: 1 })
            .toArray();

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        return NextResponse.json({ error: 'Erro ao buscar mensagens' }, { status: 500 });
    }
}
