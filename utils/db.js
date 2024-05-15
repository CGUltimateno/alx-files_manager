const mongodb = require('mongodb');
/**
 * MongoDB connection
 */
class DBClient {
    /**
     * creates a new instance of DBClient
     */
    constructor() {
        this.client = null;

        this.host = process.env.DB_HOST || 'localhost';
        this.port = process.env.DB_PORT || 27017;
        this.database = process.env.DB_DATABASE || 'files_manager';

        this.url = `mongodb://${this.host}:${this.port}/${this.database}`;

        this.client = new mongodb.MongoClient(this.url,
            { useNewUrlParser: true, useUnifiedTopology: true });

        this.client.connect();
    }

    /**
     *  check if mongodb client is connected
     */
    isAlive() {
        return this.client.topology.isConnected();
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
    async userCollections() {
        return this.client.db().collection('users');
    }

    /**
     * gets a reference to the `files` collection.
     */
    async fileCollections() {
        return this.client.db().collection('files');
    }
}

const dbClient = new DBClient();
export default dbClient;
module.exports = dbClient;