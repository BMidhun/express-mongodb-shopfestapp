const bodyParser = require('body-parser')
const express = require('express');
const path = require('path');
const UserService = require('../services/user');
const rootDir = require('../utils/path');
const session = require('express-session');
const { sessionToDB, uri } = require('../config/config');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const { imageStorage, imageFilter } = require('../utils/imageStorage');



module.exports = (app) => {



  const mongouser = process.env.NO_SQL_USER;
  const password = process.env.NO_SQL_PASSWORD;
  const cluster = process.env.NO_SQL_CLUSTER;
  const dbname = process.env.NO_SQL_DBNAME;
  const uri = `mongodb+srv://${mongouser}:${password}${cluster}/${dbname}`;



  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(multer({ storage: imageStorage, fileFilter: imageFilter }).single('image'));

  app.use(bodyParser.json());



  app.use(express.static(path.join(rootDir, 'public')));

  app.use('/uploads', express.static(path.join(rootDir, 'uploads')))

  app.use(session({
    store: sessionToDB(uri),
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
  }));

  app.use(csrf());

  app.use(async (req, res, next) => {
    if (req.session.user) {
      const user = await UserService.findUserById(req.session.user._id);
      req.user = user;
      next();
    }
    else
      next();
  });

  app.use(flash()) // This line of code should be placed below where you set the session middleware.

  app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;  // This is a method to pass variables into the views by parsing the values into the response. So for each corresponding request, 
    // these values are passed alongside with other values mentioned in res.render() function.
    res.locals.csrfToken = req.csrfToken();
    next();
  })



  return app;
} 