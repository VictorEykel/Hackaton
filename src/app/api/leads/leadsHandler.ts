import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodbClient'; // ajuste o caminho conforme seu projeto
import { ObjectId } from 'mongodb';

const collectionName = 'leads';

export async function handleLeadsPost(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body || !body.email || !body.name) {
            return new NextResponse(JSON.stringify({ error: 'Nome e email são obrigatórios' }), { status: 400 });
        }

        const db = await getDb();
        const leadsCollection = db.collection(collectionName);

        // Verifica se o lead já existe pelo email
        const existingLead = await leadsCollection.findOne({ email: body.email });

        if (existingLead) {
            // Atualiza dados do lead (exemplo: nome e data de atualização)
            await leadsCollection.updateOne(
                { _id: existingLead._id },
                { $set: { name: body.name, updatedAt: new Date() } }
            );

            return new NextResponse(JSON.stringify({ message: 'Lead atualizado', leadId: existingLead._id }), {
                status: 200,
            });
        }

        // Cria novo lead
        const newLead = {
            name: body.name,
            email: body.email,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await leadsCollection.insertOne(newLead);

        return new NextResponse(JSON.stringify({ message: 'Lead criado', leadId: result.insertedId }), {
            status: 201,
        });
    } catch (error) {
        console.error('Erro no handleLeadsPost:', error);
        return new NextResponse(JSON.stringify({ error: 'Erro interno no servidor' }), { status: 500 });
    }
}

export async function handleLeadsGet() {
    try {
        const db = await getDb();
        const leadsCollection = db.collection(collectionName);

        const leads = await leadsCollection.find().sort({ createdAt: -1 }).toArray();

        return new NextResponse(JSON.stringify(leads), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Erro no handleLeadsGet:', error);
        return new NextResponse(JSON.stringify({ error: 'Erro interno no servidor' }), { status: 500 });
    }
}
