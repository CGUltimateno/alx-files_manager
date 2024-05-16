import dbClient from '../utils/db';
import redisClient from '../utils/redis';

/**
 * Creates handlers /status and /stats endpoints
 */
export default class AppController {
    static getHome(request, response) {
        response.status(200).send('Hello, World!');
    }

    static getStatus(request, response) {
        const redisStatus = redisClient.isAlive();
        const mongoStatus = dbClient.isAlive();
        response.status(200).json({ redis: redisStatus, db: mongoStatus });
    }

    static getStats(request, response) {
        Promise.all([dbClient.nbUsers(), dbClient.nbFiles()])
            .then(([users, files]) => {
                response.status(200).json({ users, files });
            });
    }
}