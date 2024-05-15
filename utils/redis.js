const redis = require('redis');

/**
 * Redis client
 */
class RedisClient {
/**
 * Promisified redis client
 */

constructor() {
    this.client = redis.createClient();
    this.alive = true;

    this.client
        .on('error', (err) => {
            console.log(err.message || err.toString());
            this.alive = false;
        })
        .on('connect', () => {
            this.alive = true;
        });
}

    /**
     *  check if redis client is connected
     */
    isAlive() {
        return this.alive;
    }

    /**
     * get value from redis
     */
    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }
    /**
     * set value in redis
     */
    async set(key, value, duration) {
        return new Promise((resolve, reject) => {
            this.client.setex(key, duration, value, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }

    /**
     * delete key from redis
     */
    async del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err, reply) => {
                if (err) reject(err);
                resolve(reply);
            });
        });
    }
}

const redisClient = new RedisClient();

export default redisClient;
module.exports = redisClient;