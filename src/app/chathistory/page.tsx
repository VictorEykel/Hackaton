'use client'
import React, { useState, useEffect } from "react";
import {
  Search,
  MessageCircle,
  User,
  Bot,
  Calendar,
  Filter,
  MoreVertical,
  Download,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Message = {
  id: number;
  sender: "user" | "bot";
  content: string;
  timestamp: string;
};

type Conversation = {
  id: number;
  userPhone: string;
  userName: string;
  lastMessage: string;
  timestamp: string;
  status: "completed" | "pending" | "active" | string;
  messageCount: number;
  avatar: string | null;
  messages: Message[];
};

export default function ChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dados de exemplo para demonstração
  const mockConversations: Conversation[] = [
    {
      id: 1,
      userPhone: "+55 11 99999-1234",
      userName: "João Silva",
      lastMessage: "Obrigado pela ajuda!",
      timestamp: "2024-06-15T10:30:00Z",
      status: "completed",
      messageCount: 15,
      avatar: null,
      messages: [
        {
          id: 1,
          sender: "user",
          content: "Olá, preciso de ajuda com meu pedido",
          timestamp: "2024-06-15T10:15:00Z",
        },
        {
          id: 2,
          sender: "bot",
          content:
            "Olá! Claro, posso te ajudar. Qual é o número do seu pedido?",
          timestamp: "2024-06-15T10:16:00Z",
        },
        {
          id: 3,
          sender: "user",
          content: "É o pedido #12345",
          timestamp: "2024-06-15T10:17:00Z",
        },
        {
          id: 4,
          sender: "bot",
          content:
            "Encontrei seu pedido! Ele está em processamento e deve ser enviado em até 2 dias úteis.",
          timestamp: "2024-06-15T10:18:00Z",
        },
        {
          id: 5,
          sender: "user",
          content: "Perfeito! Tem como acompanhar o envio?",
          timestamp: "2024-06-15T10:19:00Z",
        },
        {
          id: 6,
          sender: "bot",
          content:
            "Sim! Assim que for despachado, você receberá um código de rastreamento por SMS.",
          timestamp: "2024-06-15T10:20:00Z",
        },
        {
          id: 7,
          sender: "user",
          content: "Obrigado pela ajuda!",
          timestamp: "2024-06-15T10:30:00Z",
        },
      ],
    },
    {
      id: 2,
      userPhone: "+55 11 88888-5678",
      userName: "Maria Santos",
      lastMessage: "Aguardando resposta...",
      timestamp: "2024-06-15T09:45:00Z",
      status: "pending",
      messageCount: 8,
      avatar: "https://github.com/VictorEykel.png",
      messages: [
        {
          id: 1,
          sender: "user",
          content:
            "Bom dia! Gostaria de saber sobre os horários de funcionamento",
          timestamp: "2024-06-15T09:30:00Z",
        },
        {
          id: 2,
          sender: "bot",
          content:
            "Bom dia! Nosso horário de funcionamento é de segunda a sexta das 8h às 18h, e sábados das 8h às 12h.",
          timestamp: "2024-06-15T09:31:00Z",
        },
        {
          id: 3,
          sender: "user",
          content: "E no domingo?",
          timestamp: "2024-06-15T09:32:00Z",
        },
        {
          id: 4,
          sender: "bot",
          content:
            "Aos domingos não funcionamos, mas você pode usar nossos canais digitais 24h.",
          timestamp: "2024-06-15T09:33:00Z",
        },
        {
          id: 5,
          sender: "user",
          content:
            "Preciso de um atendimento mais específico, tem como falar com um humano?",
          timestamp: "2024-06-15T09:45:00Z",
        },
      ],
    },
    {
      id: 3,
      userPhone: "+55 11 77777-9012",
      userName: "Pedro Costa",
      lastMessage: "Problema resolvido!",
      timestamp: "2024-06-14T16:20:00Z",
      status: "completed",
      messageCount: 12,
      avatar: null,
      messages: [
        {
          id: 1,
          sender: "user",
          content: "Oi, estou com problema no login",
          timestamp: "2024-06-14T16:00:00Z",
        },
        {
          id: 2,
          sender: "bot",
          content:
            "Olá! Vou te ajudar com o login. Você está recebendo alguma mensagem de erro específica?",
          timestamp: "2024-06-14T16:01:00Z",
        },
        {
          id: 3,
          sender: "user",
          content: "Sim, diz que minha senha está incorreta",
          timestamp: "2024-06-14T16:02:00Z",
        },
        {
          id: 4,
          sender: "bot",
          content:
            "Você gostaria de redefinir sua senha? Posso enviar um link para seu email.",
          timestamp: "2024-06-14T16:03:00Z",
        },
        {
          id: 5,
          sender: "user",
          content: "Sim, por favor!",
          timestamp: "2024-06-14T16:04:00Z",
        },
        {
          id: 6,
          sender: "bot",
          content:
            "Link enviado para seu email cadastrado. Verifique também a caixa de spam.",
          timestamp: "2024-06-14T16:05:00Z",
        },
        {
          id: 7,
          sender: "user",
          content: "Problema resolvido!",
          timestamp: "2024-06-14T16:20:00Z",
        },
      ],
    },
  ];

  useEffect(() => {
    setConversations(mockConversations);
    setSelectedConversation(mockConversations[0]);
  }, []);

  const formatTimestamp = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const formatMessageTime = (timestamp: string | number | Date) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: any) => {
    switch (status) {
      case "completed":
        return "Finalizada";
      case "pending":
        return "Pendente";
      case "active":
        return "Ativa";
      default:
        return "Desconhecido";
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.userPhone.includes(searchTerm) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || conv.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-screen bg-gray-50 ml-14  ">
      {/* Sidebar - Lista de Conversas */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Histórico de Conversas
          </h1>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="completed">Finalizadas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`mb-2 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedConversation?.id === conversation.id
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm text-gray-900 truncate">
                          {conversation.userName}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(conversation.timestamp)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mb-2">
                        {conversation.userPhone}
                      </p>

                      <p className="text-sm text-gray-600 truncate mb-2">
                        {conversation.lastMessage}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge
                          className={`text-xs ${getStatusColor(
                            conversation.status
                          )}`}
                        >
                          {getStatusText(conversation.status)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {conversation.messageCount} mensagens
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Área Principal - Visualização da Conversa */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header da conversa */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedConversation.avatar} />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedConversation.userName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.userPhone}
                    </p>
                  </div>

                  <Badge
                    className={`${getStatusColor(selectedConversation.status)}`}
                  >
                    {getStatusText(selectedConversation.status)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Calendar className="w-4 h-4 mr-2" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir conversa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Área de mensagens */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[70%] ${
                        message.sender === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {message.sender === "user" ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "user"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-gray-500">
                Escolha uma conversa da lista para visualizar o histórico
                completo
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
