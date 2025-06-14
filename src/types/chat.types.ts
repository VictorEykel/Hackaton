// types/chat.types.ts

import { ObjectId } from 'mongodb';

export interface Mensagem {
    _id?: ObjectId;
    usuario_id: ObjectId;
    session_id: string;
    mensagem: {
        role: 'user' | 'assistant';
        content: string;
    };
    enviada_em: Date;
}

export interface ChatSession {
    _id?: ObjectId;
    sessionId: string;
    usuario_id: ObjectId;
    createdAt: Date;
}
