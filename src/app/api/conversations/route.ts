// app/api/conversations/route.ts
import { NextRequest } from 'next/server';
import { handleConversationsGet } from './conversationsHandler';

export async function GET(request: NextRequest) {
    return await handleConversationsGet(request);
}


