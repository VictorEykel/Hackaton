import { NextRequest } from 'next/server';
import { handleLeadsPost, handleLeadsGet } from './leadsHandler';

export async function POST(request: NextRequest) {
    return await handleLeadsPost(request);
}

export async function GET(request: NextRequest) {
    return await handleLeadsGet();
}
