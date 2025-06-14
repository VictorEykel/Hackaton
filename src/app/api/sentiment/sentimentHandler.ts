import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function handleSentimentPost(request: NextRequest) {
    // Simulação de análise de sentimento
    return NextResponse.json({ message: 'POST /api/sentiment funcionando' });
}
