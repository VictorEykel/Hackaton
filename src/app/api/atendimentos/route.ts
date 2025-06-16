import { NextRequest } from 'next/server';
import { handleAtendimentosGet } from './atendimentosHandler';

export async function GET(request: NextRequest) {
    return await handleAtendimentosGet(request);
}
