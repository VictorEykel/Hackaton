"use client";
import React, { useState, useEffect, useRef } from "react";
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
    ArrowLeft,
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

import type { Mensagem } from '@/types/chat.types';

interface ConversationSummary {

    sessionId: string;
    userName: string;
    userPhone: string;
    status: string;
    lastMessage: string;
    lastMessageDate: string | Date;
    avatar: string;
}

function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

export default function ChatHistoryPage() {
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<ConversationSummary | null>(null);
    const [messages, setMessages] = useState<Mensagem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showConversationList, setShowConversationList] = useState(true);

    // Ref para controlar o scroll da área de mensagens
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Busca as conversas ao montar o componente
    useEffect(() => {
        async function fetchConversations() {
            try {
                const res = await fetch('/api/conversations');
                const data = await res.json();
                setConversations(data);
                if (data.length > 0) {
                    setSelectedConversation(data[0]);
                }
            } catch (error) {
                console.error('Erro ao buscar conversas:', error);
            }
        }
        fetchConversations();
    }, []);

    // Busca as mensagens sempre que a conversa selecionada mudar
    useEffect(() => {
        async function fetchMessages(sessionId: string) {
            try {
                const res = await fetch(`/api/messages?sessionId=${encodeURIComponent(sessionId)}`);
                const data = await res.json();
                setMessages(data); // Substitui o estado, evita duplicação
            } catch (error) {
                console.error('Erro ao buscar mensagens:', error);
                setMessages([]);
            }
        }

        if (selectedConversation?.sessionId) {
            fetchMessages(selectedConversation.sessionId);
        } else {
            setMessages([]);
        }
    }, [selectedConversation]);

    // Auto-scroll para a última mensagem quando mensagens mudam
    useEffect(() => {
        messagesEndRef.current?.scrollTo({
            top: messagesEndRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    // Seleciona uma conversa e mostra o histórico
    const handleConversationSelect = (conversation: ConversationSummary) => {
        setSelectedConversation(conversation);
        setShowConversationList(false);
    };

    // Voltar para lista de conversas
    const handleBackToList = () => {
        setShowConversationList(true);
        setSelectedConversation(null);
        setMessages([]);
    };

    // Filtra as conversas conforme busca e filtro de status
    const filteredConversations = conversations.filter((conv) => {
        const matchesSearch =
            conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.userPhone.includes(searchTerm) ||
            conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || conv.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex flex-col sm:flex-row h-screen bg-gray-50 sm:ml-14">
            {/* Lista de Conversas - Sidebar no desktop, fullscreen no mobile */}
            <div
                className={`
        ${showConversationList ? "flex" : "hidden sm:flex"} 
        w-full sm:w-1/3 bg-white border-r border-gray-200 flex-col
      `}
            >
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3 py-4">
                        <MessageCircle size={30} />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Histórico de conversas
                        </h1>
                    </div>

                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Buscar conversas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

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
                </div>

                <ScrollArea ref={messagesEndRef} style={{ overflowY: 'auto', maxHeight: '100%' }} className="flex-1">
                    <div className="p-2">
                        {filteredConversations.map((conversation) => (
                            <Card
                                key={conversation.sessionId}
                                className={`mb-2 cursor-pointer transition-colors hover:bg-gray-50 ${selectedConversation?.sessionId === conversation.sessionId
                                    ? "border-blue-500 bg-blue-50"
                                    : ""
                                    }`}
                                onClick={() => handleConversationSelect(conversation)}
                            >
                                <CardContent className="p-3">
                                    <div className="flex items-start gap-3">
                                        <Avatar className="w-10 h-10 flex-shrink-0">
                                            <AvatarImage src={conversation.avatar || undefined} />
                                            <AvatarFallback>
                                                <User className="w-5 h-5" />
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-medium text-sm text-gray-900 truncate">
                                                    {conversation.userName}
                                                </h3>
                                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                                    {(conversation.lastMessageDate.toString())}
                                                </span>
                                            </div>

                                            <p className="text-xs text-gray-500 mb-2 truncate">
                                                {conversation.userPhone}
                                            </p>

                                            <p className="text-sm text-gray-600 truncate mb-2">
                                                {truncateText(conversation.lastMessage.toString(), 55)}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <Badge
                                                    className={`text-xs ${(
                                                        conversation.status
                                                    )}`}
                                                >
                                                    {(conversation.status)}
                                                </Badge>

                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredConversations.length === 0 && (
                            <div className="text-center py-8">
                                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Nenhuma conversa encontrada</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Área Principal - Visualização da Conversa */}
            <div
                className={`
        ${!showConversationList ? "flex" : "hidden sm:flex"} 
        flex-1 flex-col
      `}
            >
                {selectedConversation ? (
                    <>
                        {/* Header da conversa */}
                        <div className="bg-white border-b border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* Botão voltar - apenas no mobile */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="sm:hidden p-2 h-auto"
                                        onClick={handleBackToList}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                    </Button>

                                    <Avatar className="w-10 h-10 flex-shrink-0">
                                        <AvatarImage
                                            src={selectedConversation.avatar || undefined}
                                        />
                                        <AvatarFallback>
                                            <User className="w-5 h-5" />
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="font-semibold text-gray-900 truncate">
                                            {selectedConversation.userName}
                                        </h2>
                                        <p className="text-sm text-gray-500 truncate">
                                            {selectedConversation.userPhone}
                                        </p>
                                    </div>

                                    <Badge
                                        className={`${(
                                            selectedConversation.status
                                        )} flex-shrink-0`}
                                    >
                                        {(selectedConversation.status)}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="hidden sm:flex"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Exportar
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="sm:hidden">
                                                <Download className="w-4 h-4 mr-2" />
                                                Exportar
                                            </DropdownMenuItem>
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
                        <ScrollArea className="flex-1 p-4" ref={messagesEndRef} style={{ overflowY: 'auto', maxHeight: '100%' }} >
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {messages.map((message) => (
                                    <div
                                        key={message._id?.toString()}
                                        className={`flex ${message.mensagem.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`flex items-start gap-2 max-w-[85%] sm:max-w-[70%] ${message.mensagem.role === "user"
                                                ? "flex-row-reverse"
                                                : "flex-row"
                                                }`}
                                        >
                                            <Avatar className="w-8 h-8 flex-shrink-0">
                                                <AvatarFallback>
                                                    {message.mensagem.role === "user" ? (
                                                        <User className="w-4 h-4" />
                                                    ) : (
                                                        <Bot className="w-4 h-4" />
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div
                                                className={`rounded-lg p-3 ${message.mensagem.role === "user"
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-100 text-gray-900"
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed break-words">
                                                    {message.mensagem.role}
                                                </p>
                                                <p
                                                    className={`text-xs mt-1 ${message.mensagem.role === "user"
                                                        ? "text-blue-100"
                                                        : "text-gray-500"
                                                        }`}
                                                >
                                                    {(message.mensagem.content)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="text-center">
                            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Selecione uma conversa
                            </h3>
                            <p className="text-gray-500 text-center">
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