export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export async function sendMessage(sessionId: string, messages: ChatMessage[]) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, messages }),
    });

    if (!response.ok) {
        throw new Error('Erro na API de chat');
    }

    return response.body;
}
