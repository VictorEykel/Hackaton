import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

type Message = {
    sessionId: string;
    timestamp: string;
    role: 'user' | 'assistant';
    content: string;
    metadata?: any;
};

type Data = {
    messages: Message[];
};

const file = path.join(process.cwd(), 'db.json');
const adapter = new JSONFile<Data>(file);
const defaultData: Data = { messages: [] };

const db = new Low<Data>(adapter, defaultData);

export async function initDB() {
    await db.read();
    db.data ||= { messages: [] };
    await db.write();
}

export async function addMessage(message: Message) {
    await db.read();
    db.data ||= { messages: [] };
    db.data.messages.push(message);
    await db.write();
}

export async function getMessagesBySession(sessionId: string) {
  await db.read();
  return (
    db.data?.messages
      .filter(m => m.sessionId === sessionId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) || []
  );
}