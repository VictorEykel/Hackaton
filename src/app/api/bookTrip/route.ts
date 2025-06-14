import { NextRequest } from 'next/server';
import { handleBookTripPost } from './bookTripHandler';

export async function POST(request: NextRequest) {
    return await handleBookTripPost(request);
}
