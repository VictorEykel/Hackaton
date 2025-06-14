import { getDb } from '../../../lib/mongodbClient';
import { ObjectId } from 'mongodb';
import type { CoreSystemMessage, CoreUserMessage, CoreAssistantMessage } from 'ai';
import type { Mensagem } from '@/types/chat.types';

export type ChatMessage = CoreSystemMessage | CoreUserMessage | CoreAssistantMessage;

export async function getOrCreateUserBySession(sessionId: string): Promise<ObjectId> {
    const db = await getDb();
    const usersCollection = db.collection('users');

    let user = await usersCollection.findOne({ sessionId });

    if (!user) {
        const result = await usersCollection.insertOne({ sessionId, createdAt: new Date() });
        user = { _id: result.insertedId, sessionId };
    }

    return user._id!;
}

export async function addMessageToConversation(
    usuario_id: ObjectId,
    sessionId: string,
    role: 'user' | 'assistant',
    content: string
) {
    const db = await getDb();
    const mensagensCollection = db.collection<Mensagem>('mensagens');

    const novaMensagem: Omit<Mensagem, '_id'> = {
        usuario_id,
        session_id: sessionId,
        mensagem: {
            role,
            content,
        },
        enviada_em: new Date(),
    };

    await mensagensCollection.insertOne(novaMensagem);
}

export async function getConversationHistory(sessionId: string): Promise<ChatMessage[]> {
    const db = await getDb();
    const mensagensCollection = db.collection<Mensagem>('mensagens');

    const history = await mensagensCollection
        .find({ session_id: sessionId })
        .sort({ enviada_em: 1 })
        .toArray();

    return history.map(m => ({
        role: m.mensagem.role,
        content: m.mensagem.content,
    }));
}
