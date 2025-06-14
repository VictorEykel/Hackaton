import { NextRequest } from 'next/server';
import { handleSentimentPost } from './sentimentHandler';

export async function POST(request: NextRequest) {
    return await handleSentimentPost(request);
}
