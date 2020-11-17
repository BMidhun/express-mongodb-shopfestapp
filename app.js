// const http = require('http');
const express = require('express');

const loader = require('./loaders')

let app = express();

const path = require('path');

const rootDir = require('./utils/path')

// returns an express server OR
// const server = http.createServer(app);
// server.listen(3001);  



const startServer = async () => {
    try {
        app = await loader(app);
        app.listen(3001, (err) => {
            err ? console.log('Server failed!') : console.log('Server running on port 3001');
        });
    } catch (error) {
        app.use(express.static(path.join(rootDir, 'public')));
        app.use((req, res, next) => {
            res.sendFile(path.join(rootDir, 'views', 'no-internet.html'));
        })
        app.listen(3001, (err) => {
            err ? console.log('Server failed!') : console.log('Server running on port 3001');
        });

    }

}

startServer();

