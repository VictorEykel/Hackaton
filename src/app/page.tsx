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
  const controller = useRef<AbortController | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    controller.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, messages: newMessages }),
        signal: controller.current.signal,
      });

      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let botMessage = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          botMessage += decoder.decode(value);
          setMessages([...newMessages, { role: "assistant", content: botMessage }]);
        }
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Assistente de Viagens IA</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] mb-4 px-2 space-y-3">
            {messages.length === 0 && (
              <p className="text-muted-foreground text-center">
                Faça uma pergunta para começar a conversa.
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[70%] whitespace-pre-wrap ${
                    msg.role === "user"
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
            />
            <Button type="submit" disabled={!input.trim()}>
              Enviar
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
