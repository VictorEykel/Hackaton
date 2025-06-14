import { NextRequest } from 'next/server';
import { handleValidateCepPost } from './validateCepHandler';

export async function POST(request: NextRequest) {
    return await handleValidateCepPost(request);
}
