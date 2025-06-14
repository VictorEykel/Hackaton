import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function handleValidateCepPost(request: NextRequest) {
    // Simulação de validação CEP
    return NextResponse.json({ message: 'POST /api/validateCep funcionando' });
}
