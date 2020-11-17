
const mongoose = require('mongoose');
const session = require('express-session');

const mongoDBSessionConnect = require('connect-mongodb-session')

let store;


const sessionToDB = (connectionstring) => {
    const mongoDBStore = mongoDBSessionConnect(session);
    store = new mongoDBStore({ collection: 'session', uri: connectionstring });
    return store;
}


const startNoSqlDB = async () => {

    try {
        const mongouser = process.env.NO_SQL_USER;
        const password = process.env.NO_SQL_PASSWORD;
        const cluster = process.env.NO_SQL_CLUSTER;
        const dbname = process.env.NO_SQL_DBNAME;
        const connectionstring = `mongodb+srv://${mongouser}:${password}${cluster}/${dbname}`
        await mongoose.connect(connectionstring, { useNewUrlParser: true })
        console.log('DB connected!');
    } catch (error) { throw new Error('DB connection failed!') }

}


module.exports = {
    startNoSqlDB,
    sessionToDB
};