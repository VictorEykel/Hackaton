// lib/chat-service.ts

import { connectToDatabase } from './mongodb';
import { Usuario, Mensagem, ChatSession } from './models/models';
import { ObjectId } from 'mongodb';

/**
 * Encontra um usuário associado a uma sessionId ou cria um novo usuário e sessão se não existirem.
 * Esta função é crucial para ligar o chat anônimo do frontend a um registro de usuário no backend.
 * @param sessionId - O ID da sessão vindo do cliente.
 * @returns O ObjectId do usuário correspondente.
 */
export async function getOrCreateUserBySession(sessionId: string): Promise<ObjectId> {
    const db = await connectToDatabase();
    const sessionsCollection = db.collection<ChatSession>('sessions');

    // 1. Tenta encontrar a sessão existente
    const existingSession = await sessionsCollection.findOne({ sessionId });

    if (existingSession) {
        return existingSession.usuario_id;
    }

    // 2. Se a sessão não existe, cria um novo usuário
    const usuariosCollection = db.collection<Usuario>('usuarios');
    const newUser: Omit<Usuario, '_id'> = {
        nome: `Usuário ${sessionId.substring(0, 6)}`, // Nome provisório
        telefone: '', // Inicialmente vazio
        status: 'ativo',
        created_at: new Date(),
        updated_at: new Date(),
        perfil: {},
    };
    const userResult = await usuariosCollection.insertOne(newUser);
    const newUserId = userResult.insertedId;

    // 3. Cria a nova sessão, ligando o sessionId ao novo newUserId
    const newSession: Omit<ChatSession, '_id'> = {
        sessionId,
        usuario_id: newUserId,
        createdAt: new Date(),
    };
    await sessionsCollection.insertOne(newSession);

    return newUserId;
}

/**
 * Salva uma mensagem (do usuário ou do assistente) na coleção de mensagens.
 * @param usuario_id - O ID do usuário.
 * @param sessionId - O ID da sessão da conversa.
 * @param role - 'user' ou 'assistant'.
 * @param content - O texto da mensagem.
 */
export async function addMessageToConversation(usuario_id: ObjectId, sessionId: string, role: 'user' | 'assistant', content: string) {
    const db = await connectToDatabase();
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

/**
 * Busca o histórico de mensagens de uma sessão, ordenado por data.
 * @param sessionId - O ID da sessão.
 * @returns Um array de mensagens no formato { role, content }.
 */
export async function getConversationHistory(sessionId: string): Promise<{ role: 'user' | 'assistant'; content: string }[]> {
    const db = await connectToDatabase();
    const mensagensCollection = db.collection<Mensagem>('mensagens');

    const history = await mensagensCollection
        .find({ session_id: sessionId })
        .sort({ enviada_em: 1 }) // Ordena do mais antigo para o mais novo
        .toArray();

    // Mapeia para o formato esperado pela API da OpenAI
    return history.map(m => m.mensagem);
}
