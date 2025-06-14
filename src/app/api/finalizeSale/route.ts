import { NextRequest } from 'next/server';
import { handleFinalizeSalePost } from './finalizeSaleHandler';

export async function POST(request: NextRequest) {
    return await handleFinalizeSalePost(request);
}
