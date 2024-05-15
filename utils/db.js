import mongodb from 'mongodb';
import Collection from 'mongodb/lib/collection';
import envLoader from './envLoader';

/**
 * MongoDB connection
 */
class DBClient {
    /**
     * creates a new instance of DBClient
     */
    constructor() {
        envLoader();
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';
        const dbURL = `mongodb://${host}:${port}/${database}`;

        this.client = new mongodb.MongoClient(dbURL, {useUnifiedTopology: true});
        this.client.connect();
    }

    /**
     *  check if mongodb client is connected
     */
    isAlive() {
        return this.client.isConnected();
    }

    /**
     * get number of users from database
     */
    async nbUsers() {
        const db = this.client.db();
        const users = db.collection('users');
        return users.countDocuments();
    }

    /**
     * get number of files from database
     */
    async nbFiles() {
        const db = this.client.db();
        const files = db.collection('files');
        return files.countDocuments();
    }

    /**
     * gets a reference to the `users` collection.
     */
    async usersCollection() {
        const db = this.client.db();
        return db.collection('users');
    }

    /**
     * gets a reference to the `files` collection.
     */
    async filesCollection() {
        const db = this.client.db();
        return db.collection('files');
    }
}

const dbClient = new DBClient();
export default dbClient;