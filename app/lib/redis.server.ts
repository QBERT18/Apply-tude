import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

type RedisCache = {
  client: Redis | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __redisCache: RedisCache | undefined;
}

const cached: RedisCache = globalThis.__redisCache ?? { client: null };

if (!globalThis.__redisCache) {
  globalThis.__redisCache = cached;
}

function getRedis(): Redis {
  if (!cached.client) {
    cached.client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
    cached.client.on("error", (err) => {
      console.error("Redis connection error:", err.message);
    });
  }
  return cached.client;
}

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number
): Promise<T> {
  try {
    const redis = getRedis();
    const hit = await redis.get(key);
    if (hit) return JSON.parse(hit) as T;

    const data = await fetcher();
    await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
    return data;
  } catch {
    return fetcher();
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const redis = getRedis();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Cache invalidation failure is non-fatal
  }
}
