import { MongoClient, Db } from 'mongodb';

// Cache da conexão para ambientes serverless como o da Vercel
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('A variável de ambiente MONGO_URI não foi definida.');
  }

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('Hackaton'); // Usando o nome do banco 'Hackaton'

    console.log('Conectado com sucesso ao banco de dados:', db.databaseName);

    cachedDb = db;
    return db;
  } catch (error) {
    console.error('Falha ao conectar ao banco de dados', error);
    process.exit(1);
  }
}