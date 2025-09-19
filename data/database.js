const { URL } = require('url');
const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

let database;

const iniDb = (callback) => {
    if (database) {
        console.log('Db is already initialized!');
        return callback(null,database);
    }
    MongoClient.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.idaqlfl.mongodb.net/project2?retryWrites=true&w=majority`)
        .then((client) => {
            database = client.db();
        callback(null,database);
    })
    .catch((err) => {
        callback(err);
    });

};

const getDatabase = () => {
    if (!database){
        throw Error('Database not initialized!')
    }
    return database;

};

module.exports = {
    iniDb,
    getDatabase

};