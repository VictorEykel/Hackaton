import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function handleBookTripPost(request: NextRequest) {
    // Simulação de reserva de viagem
    return NextResponse.json({ message: 'POST /api/bookTrip funcionando' });
}
