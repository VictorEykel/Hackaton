import { ChartOverview } from "@/components/chart";
import Sales from "@/components/sales";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Usuario } from "@/types/user.types";
import { MessageCircleMore, Users, MessageCircle } from "lucide-react";

interface DashboardData {
    kpis: {
        totalUsers: number;
        activeSessions: number;
        aliveChats: number;
    };
    lastClients:{
         ultimosClientes: Usuario[];
    };
    
    reports: { id: number; title: string; createdAt: string }[];
}
// Função para buscar dados do dashboard via API interna
async function fetchDashboardData(): Promise<DashboardData> {
    // Use URL absoluta para evitar erro no Server Component
    // Configure NEXT_PUBLIC_BASE_URL no seu .env.local (ex: http://localhost:3000)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/dashboard`, {
        cache: 'no-store', // força buscar dados sempre atualizados
    });

    if (!res.ok) {
        throw new Error('Falha ao carregar dados do dashboard');
    }

    return res.json();
}

export default async function DashboardPage() {
    const data = await fetchDashboardData();

    return (
        <main className="sm:ml-14 p-4">
            <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-center">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                Conversas Iniciadas
                            </CardTitle>
                            <MessageCircleMore className="ml-auto w-4 h-4" />
                        </div>
                        <CardDescription>Total de conversas iniciadas no mês atual.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base sm:text-lg font-bold text-gray-900">
                            {data.kpis.activeSessions}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-center">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                Novos Clientes
                            </CardTitle>
                            <Users className="ml-auto w-4 h-4" />
                        </div>
                        <CardDescription>Novos clientes cadastrados no mês atual.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base sm:text-lg font-bold text-gray-900">
                            {data.kpis.totalUsers}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-center">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                Chats Ativos
                            </CardTitle>
                            <MessageCircle className="ml-auto w-4 h-4" />
                        </div>
                        <CardDescription>Total de chats ativos hoje.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base sm:text-lg font-bold text-gray-900">
                            {data.kpis.aliveChats}
                        </p>
                    </CardContent>
                </Card>
            </section>

            <section className="mt-4 flex flex-col gap-4 md:flex-row">
                <ChartOverview />

                <Sales usuarios={data.lastClients.ultimosClientes}/>
            </section>
        </main>
    );
}
