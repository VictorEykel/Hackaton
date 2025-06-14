import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function handleBookHotelPost(request: NextRequest) {
    // Simulação de reserva de hotel
    return NextResponse.json({ message: 'POST /api/bookHotel funcionando' });
}
