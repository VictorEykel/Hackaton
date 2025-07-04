// app/chat/page.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from "uuid";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sessionId, setSessionId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Inicializa sessão e carrega histórico
    useEffect(() => {
        let currentSessionId = localStorage.getItem("chatSessionId");

        if (!currentSessionId) {
            currentSessionId = uuidv4();
            localStorage.setItem("chatSessionId", currentSessionId);
        }
        setSessionId(currentSessionId);

        const fetchHistory = async (id: string) => {
            try {
                const res = await fetch(`/api/chat?sessionId=${id}`);
                if (res.ok) {
                    const history = await res.json();
                    setMessages(history);
                }
            } catch (error) {
                console.error("Erro ao buscar histórico:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory(currentSessionId);
    }, []);

    // Scroll automático ao atualizar mensagens
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || !sessionId) return;

        const userMessage: Message = { role: "user", content: input.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    messages: newMessages, // Envia todo o histórico para o backend
                }),
            });

            if (!res.body) throw new Error("Resposta sem corpo");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let assistantContent = "";

            // Adiciona mensagem do assistente vazia para atualizar em stream
            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    assistantContent += decoder.decode(value);
                    setMessages((prev) => {
                        // Atualiza a última mensagem (assistente) com o conteúdo recebido
                        const updated = [...prev];
                        updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                        return updated;
                    });
                }
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Erro de conexão. Tente novamente." },
            ]);
        }
    };

    return (
        <main className="max-w-3xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Assistente de Viagens IA</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] mb-4 px-2" ref={scrollAreaRef}>
                        {isLoading ? (
                            <p className="text-muted-foreground text-center">Carregando histórico...</p>
                        ) : messages.length === 0 ? (
                            <p className="text-muted-foreground text-center">
                                Faça uma pergunta para começar a conversa.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`rounded-lg p-3 max-w-[70%] whitespace-pre-wrap ${msg.role === "user"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            <strong className="block mb-1">
                                                {msg.role === "user" ? "Você" : "Assistente"}
                                            </strong>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            type="text"
                            placeholder="Digite sua pergunta sobre viagens..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            autoFocus
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={!input.trim() || isLoading}>
                            Enviar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
