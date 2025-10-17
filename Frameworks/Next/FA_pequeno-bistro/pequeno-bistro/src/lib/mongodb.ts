import mongoose from 'mongoose';

// Usar o objeto global para manter a conexão em modo de desenvolvimento (Next.js hot reload)
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined; // Definido como undefined para compatibilidade com o globalThis
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Por favor, defina a variável de ambiente MONGODB_URI no arquivo .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // Usar uma conexão existente é crucial para o desempenho do Next.js
    // console.log('Usando conexão MongoDB existente');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Desabilitar o buffering de comandos
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    // console.log('Criando nova conexão MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        // console.log('Conexão MongoDB estabelecida com sucesso');
        return mongoose;
      })
      .catch((error) => {
        // console.error('Erro ao conectar com MongoDB:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Resetar promise em caso de falha
    throw error;
  }

  return cached.conn;
}

export default dbConnect;