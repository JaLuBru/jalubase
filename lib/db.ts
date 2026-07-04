import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var dashboardPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

export function getPool() {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!global.dashboardPool) {
    global.dashboardPool = new Pool({ connectionString });
  }

  return global.dashboardPool;
}
