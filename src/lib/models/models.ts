// src/models.ts

import { ObjectId } from 'mongodb';

export interface Usuario {
    _id?: ObjectId; // O '?' indica que o campo é opcional (ao criar um novo usuário)
    nome: string;
    telefone: string;
    status: 'ativo' | 'lead' | 'convertido'; // Tipos literais para o status
    created_at: Date;
    updated_at: Date;
    perfil: {
        preferencias_viagem?: {
            destinos: string[];
            atividades: string[];
            orcamento: string;
        }
    };
}

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
    sessionId: string; // O ID que vem do frontend
    usuario_id: ObjectId; // O ID do usuário correspondente no banco
    createdAt: Date;
}