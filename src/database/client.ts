import postgres from 'postgres';
import { config } from '../config/index.js';
import { drizzle } from 'drizzle-orm/postgres-js';

const queryClient = postgres(config.DATABASE_URL);
export const db = drizzle(queryClient);
export { queryClient };
