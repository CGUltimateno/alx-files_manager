import { promisfy } from 'util';
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
    isAlive(){
        return this.isClientConnected;
    }
    /**
     * get value from redis
     * @param {string} key
     * @returns {Promise<string>}
     */
    async get(key){
        const getAsync = promisify(this.client.get).bind(this.client);
        return getAsync(key);
        }

    /**
     * set value in redis
     */
    async set(key, value, duration) {
        this.client.set(key, value);
        this.client.expire(key, duration);
    }
    /**
     * delete key from redis
     */
    async del(key) {
        this.client.del(key);
    }
}
const redisClient = new RedisClient();
export default redisClient;