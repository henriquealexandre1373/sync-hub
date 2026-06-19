import Fastify from 'fastify';
import { queryClient } from './database/client.js';
import { redis } from './redis/client.js';

export function buildApp() {
  const app = Fastify({ logger: true });

  app.get('/health', async () => {
    return { status: 'ok' };
  });

  app.get('/ready', async (request, reply) => {
    const checks = { postgres: false, redis: false };

    try {
      await queryClient`SELECT 1`;
      checks.postgres = true;
    } catch (err) {
      request.log.error({ err }, 'readiness: postgres failed');
    }

    try {
      await redis.ping();
      checks.redis = true;
    } catch (err) {
      request.log.error({ err }, 'readiness: redis failed');
    }

    const allOk = Object.values(checks).every(Boolean);
    reply.code(allOk ? 200 : 503);
    return { status: allOk ? 'ready' : 'degraded', checks };
  });

  return app;
}
