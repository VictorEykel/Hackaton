'use client';

import { useState, useCallback } from 'react';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = useCallback(async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: 'default-session', // você pode adaptar para gerar/usar session real
                    messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
                }),
            });

            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('Stream não disponível');

            let assistantMessage = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                assistantMessage += new TextDecoder().decode(value);
            }

            const assistantMsg: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: assistantMessage,
            };

            setMessages((prev) => [...prev, assistantMsg]);
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    }, [input, messages]);

    return {
        messages,
        input,
        isLoading,
        error,
        handleInputChange,
        handleSubmit,
    };
}
