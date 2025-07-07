import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";
import fs from "fs";

// PostgreSQL connection details
const host = process.env.DB_HOST || "localhost";
const port = Number(process.env.DB_PORT) || 5432;
const user = process.env.DB_USER || "postgres";
const database = process.env.DB_NAME || "postgres";
const password = process.env.DB_PASSWORD || "postgres";

let ssl;
if (process.env.NODE_ENV === "production" && process.env.DB_CA_PATH) {
  ssl = {
    ca: fs.readFileSync(process.env.DB_CA_PATH).toString(),
    rejectUnauthorized: true,
  };
}

export const storage = new PostgresStore({
  host,
  port,
  user,
  database,
  password,
  ...(ssl ? { ssl } : {}),
});

// Initialize memory with PostgreSQL storage
export const celentMemory = new Memory({
  storage: storage,
  options: {
    threads: {
      generateTitle: false,
    },
    lastMessages: 10,
    semanticRecall: false,
  },
});