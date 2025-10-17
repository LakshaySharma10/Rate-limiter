import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN, 
});

const WINDOW_SIZE = 60 * 1000; 
const MAX_REQUESTS = 10;

export async function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  try {
    await redisClient.zremrangebyscore(ip, 0, now - WINDOW_SIZE);

    const count = await redisClient.zcard(ip);

    if (count >= MAX_REQUESTS) {
      return res.status(429).json({
        error: "Too many requests.",
      });
    }

    await redisClient.zadd(ip, { score: now, member: now.toString() });

    await redisClient.expire(ip, WINDOW_SIZE / 1000);

    next();
  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
