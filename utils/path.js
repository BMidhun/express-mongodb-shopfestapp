const path = require('path');

rootDir = path.dirname(process.mainModule.filename);
//process.mainModule.filename refers to the entry file of the application. i.e app.js or server.js in the root folder
module.exports = rootDir;