import Queue from 'bull/lib/queue';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import Utils from '../utils/utils';
import redisClient from '../utils/redis';

const queue = new Queue('sending email');

export default class UsersController {
    static async postNew(req, res) {
        const email = req.body ? req.body.email : null;
        const password = req.body ? req.body.password : null;

        if (!email) {
            res.status(400).json({ error: 'Missing email' });
            return;
        }
        if (!password) {
            res.status(400).json({ error: 'Missing password' });
            return;
        }
        const user = await (await dbClient.userCollections()).findOne({ email });

        if (user) {
            res.status(400).json({ error: 'Already exist' });
            return;
        }
        const createdUser = await (await dbClient.userCollections())
            .insertOne({ email, password: Utils.hashPassword(password) });

        const userId = createdUser.insertedId.toString('utf-8');
        queue.add({ userId });

        res.status(201).json({ userId, email });
    }

    static async getMe(req, res) {
        const token = req.header('X-Token');

        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const userId = await redisClient.get(`auth_${token}`);

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const user = await (await dbClient.usersCollection()).findOne({ _id: ObjectId(userId) });

        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        res.status(200).json({ email: user.email, id: userId });
    }
}