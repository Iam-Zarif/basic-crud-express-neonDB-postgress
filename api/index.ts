import type { IncomingMessage, ServerResponse } from "node:http";
import app from "../src/app";
import { initDB } from "../src/db";

let dbReady: Promise<void> | null = null;

const ensureDbReady = () => {
  dbReady ??= initDB();
  return dbReady;
};

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  await ensureDbReady();
  app(req, res);
}
