import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function handleValidateCpfPost(request: NextRequest) {
    try {
        const body = await request.json();
        const { cpf } = body;

        if (!cpf) {
            return NextResponse.json({ error: 'CPF não informado' }, { status: 400 });
        }

        // Ajuste o caminho do webhook conforme configurado no n8n
        const webhookPath = '/webhook/validateCpf'; // Exemplo: caminho do webhook no n8n
        // Remova '/api/v1' da baseURL para webhook, pois webhooks não ficam em /api/v1
        const baseUrl = process.env.N8N_API_BASE_URL?.replace(/\/api\/v1$/, '') ?? '';

        const url = `${baseUrl}${webhookPath}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Se seu webhook não exigir token, pode remover esta linha
                Authorization: process.env.N8N_API_TOKEN ? `Bearer ${process.env.N8N_API_TOKEN}` : '',
            },
            body: JSON.stringify({ cpf }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Falha na validação do CPF via n8n: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao validar CPF:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
