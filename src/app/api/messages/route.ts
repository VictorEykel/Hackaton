// src/app/api/messages/route.ts
import { NextRequest } from 'next/server';
import { handleMessagesGet } from './messagesHandler';

export async function GET(request: NextRequest) {
    return await handleMessagesGet(request);
}
