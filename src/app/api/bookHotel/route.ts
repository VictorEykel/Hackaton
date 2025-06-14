import { NextRequest } from 'next/server';
import { handleBookHotelPost } from './bookHotelHandler';

export async function POST(request: NextRequest) {
    return await handleBookHotelPost(request);
}
