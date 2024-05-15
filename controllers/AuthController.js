import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import Utils from '../utils/utils';
import redisClient from '../utils/redis';

export default class AuthController {
    static async getConnect(req, res){
        const authHeader = req.headers ? req.headers.authorization : null;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');

        if (!credentials || !credentials.includes(':')) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const [email, password] = credentials.split(':');

        if (!email || !password) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const user = await (await dbClient.userCollections()).findOne({ email });

        if (!user || user.password !== Utils.hashPassword(password)) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const accessToken = uuidv4().toString();
        const duration = 24 * 60 * 60;
        const userId = user._id.toString();

        await redisClient.set(`auth_${accessToken}`, userId, duration);

        res.status(200).json({ accessToken });
    }
    static async getDisconnect(req, res){
        const token = req.header('X-Token');
        const userId = await redisClient.get(`auth_${token}`);
        const user = await (await dbClient.userCollections()).findOne({ _id: new ObjectId(userId) });

        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if(!user){
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        await redisClient.del(`auth_${token}`);
        res.status(204).send();
    }
}