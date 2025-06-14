import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function handleFinalizeSalePost(request: NextRequest) {
    // Simulação de finalização de venda
    return NextResponse.json({ message: 'POST /api/finalizeSale funcionando' });
}
