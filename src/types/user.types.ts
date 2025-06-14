// types/user.types.ts

import { ObjectId } from 'mongodb';

export interface Usuario {
    _id?: ObjectId;
    nome: string;
    telefone: string;
    status: 'ativo' | 'lead' | 'convertido';
    created_at: Date;
    updated_at: Date;
    perfil: {
        preferencias_viagem?: {
            destinos: string[];
            atividades: string[];
            orcamento: string;
        };
    };
}
