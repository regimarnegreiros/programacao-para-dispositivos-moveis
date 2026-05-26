import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Extrai os dados diretamente da tua conexão MySQL do ficheiro .env
const dbUrl = new URL(process.env.DATABASE_URL);

// Configura o adaptador para se conectar ao teu servidor MySQL
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: dbUrl.port ? parseInt(dbUrl.port, 10) : 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
});

/**
 * Instância única do PrismaClient partilhada por toda a aplicação.
 */
export const prisma = new PrismaClient({ adapter });