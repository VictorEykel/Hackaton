// src/lib/mongodbClient.ts

import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('A variável de ambiente MONGO_URI não foi definida.');
}

// Variáveis globais para cache da conexão (para evitar múltiplas conexões em serverless)
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

let cachedClient: MongoClient;
let cachedDb: Db;

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
  global._mongoClient = client;
}

cachedClient = global._mongoClient!;
cachedDb = cachedClient.db('Hackaton');

export async function getMongoClient(): Promise<MongoClient> {
  return cachedClient;
}

export async function getDb(): Promise<Db> {
  return cachedDb;
}
