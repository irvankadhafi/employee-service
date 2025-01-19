import Redis from 'ioredis';
import { config } from 'dotenv';

config();

export const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
});