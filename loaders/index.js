const setViewEngine = require('./viewengine');
const setMiddlewareLoader = require('./middleware');
const setRoutes = require('./routes');
const intialize_Env = require('../config');
const { initiateEmailTransport } = require('./emailservice');
const startNoSqlDB = require('../config/config').startNoSqlDB;

module.exports = async (app) => {
    try {
        let server = app;
        intialize_Env();
        await startNoSqlDB(app);
        server = setViewEngine(server);
        server = setMiddlewareLoader(server);
        server = setRoutes(server);
        initiateEmailTransport();
        return server;
    } catch (err) {
        throw new Error('DB Connection Failed!')
    }
}