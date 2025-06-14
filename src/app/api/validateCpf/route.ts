import { NextRequest } from 'next/server';
import { handleValidateCpfPost } from './validateCpfHandler';

export async function POST(request: NextRequest) {
    return await handleValidateCpfPost(request);
}
