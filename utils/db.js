const mongodb = require('mongodb');
// eslint-disable-next-line no-unused-vars
const envLoader = require('./env_loader');
const Collection = require('mongodb/lib/collection');
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

        this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
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
        return this.client.db().collection('users').countDocuments();
    }

    /**
     * get number of files from database
     */
    async nbFiles() {
        return this.client.db().collection('files').countDocuments();
    }

    /**
     * gets a reference to the `users` collection.
     */
    async usersCollection() {
        return this.client.db().collection('users');
    }

    /**
     * gets a reference to the `files` collection.
     */
    async filesCollection() {
        return this.client.db().collection('files');
    }
}

const dbClient = new DBClient();
module.exports = dbClient;