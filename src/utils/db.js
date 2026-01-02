const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL;

// 1.Create a connection pool to postgress
//The Pool manages a "stash" of open connections to your Neon database.
//  It keeps them alive so your app doesn't waste time logging in and out for every single request.
const pool = new Pool({ connectionString });
// 2. create the prisma adapter
//The Adapter is the converter block.
// It takes Prisma's orders and translates them into instructions that the pg Pool understands.
const adapter = new PrismaPg(pool);
// 3. Pass the adapter client
// Finally, when we start the main Prisma engine,
//  we pass it the adapter. We are effectively saying:
// "Do not try to connect to the database yourself.
// Use this Adapter we built for you."
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
