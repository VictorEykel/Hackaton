import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodbClient';

export async function handleDashboardGet(request: NextRequest) {
    try {
        const db = await getDb();

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        // 1. Conversas iniciadas neste mês
        const conversasIniciadas = await db.collection('sessions').countDocuments({
            createdAt: { $gte: firstDayOfMonth, $lt: firstDayNextMonth },
        });

        // 2. Novos clientes cadastrados no mês
        const novosClientesCount = await db.collection('users').countDocuments({
            created_at: { $gte: firstDayOfMonth, $lt: firstDayNextMonth },
        });

        // 3. Últimos clientes cadastrados (ordenados por created_at desc, limit 5)
        const ultimosClientesRaw = await db
            .collection('usuarios')
            .find({})
            .sort({ created_at: -1 })
            .limit(5)
            .project({
                _id: 1,
                nome: 1,
                telefone: 1,
                status: 1,
                created_at: 1,
                updated_at: 1,
                perfil: 1,
            })
            .toArray();

        // Converter _id para string
        const ultimosClientes = ultimosClientesRaw.map(user => ({
            ...user,
            _id: user._id.toString(),
            nome: user.nome || 'Nome não informado',
            telefone: user.telefone || 'Telefone não informado',
        }));


        const dashboardData = {
            kpis: {
                totalUsers: novosClientesCount,
                activeSessions: conversasIniciadas,
                aliveChats: 10000, 
            },
            lastClients: { ultimosClientes, },
            reports: []
        };

        return NextResponse.json(dashboardData);
    } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar dados do dashboard' },
            { status: 500 }
        );
    }
}
