import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Redis client
 */
class RedisClient {
/**
 * Promisified redis client
 */

constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
        console.error('Redis client failed to connect:', err.message || err.toString());
        this.isClientConnected = false;
    });
    this.client.on('connect', () => {
        this.isClientConnected = true;
    });
}

    /**
     *  check if redis client is connected
     */
    isAlive() {
        return this.isClientConnected;
    }

    /**
     * get value from redis
     * @param {string} key
     * @returns {Promise<string>}
     */
    async get(key) {
        return promisify(this.client.GET).bind(this.client)(key);
    }

    /**
     * set value in redis
     */
    async set(key, value, duration) {
        await promisify(this.client.SETEX)
            .bind(this.client)(key, duration, value);
    }

    /**
     * delete key from redis
     */
    async del(key) {
        await promisify(this.client.DEL).bind(this.client)(key);
    }
}
export const redisClient = new RedisClient();
export default redisClient;