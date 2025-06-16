import { NextRequest, NextResponse } from 'next/server';
import { resumoHandler } from './resumoHandler';

export async function POST(request: NextRequest) {
  try {
    return await resumoHandler(request);
  } catch (error) {
    console.error('Erro no resumoHandler:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}