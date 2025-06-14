import { NextRequest } from 'next/server';
import { handleChatGet, handleChatPost } from './chatHandler';

export async function GET(request: NextRequest) {
  return await handleChatGet(request);
}

export async function POST(request: NextRequest) {
  return await handleChatPost(request);
}
