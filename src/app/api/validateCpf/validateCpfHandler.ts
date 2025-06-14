import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function handleValidateCpfPost(request: NextRequest) {
    // Simulação de validação CPF
    return NextResponse.json({ message: 'POST /api/validateCpf funcionando' });
}
