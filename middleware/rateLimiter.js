import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN, 
});

const Window_size = process.env.WINDOW_SIZE;
const Max_Requests = process.env.MAX_REQUESTS;

export async function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  try {
    await redisClient.zremrangebyscore(ip, 0, now - Window_size);

    const count = await redisClient.zcard(ip);

    if (count >= Max_Requests) {
      return res.status(429).json({
        error: "Too many requests.",
      });
    }

    await redisClient.zadd(ip, { score: now, member: now.toString() });

    await redisClient.expire(ip, Window_size / 1000);

    next();
  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
