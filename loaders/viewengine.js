module.exports = (app) => {

    app.set('view engine','pug'); 
    // Pug is built when it is added to the package.json file.
    app.set('views','views');

    return app;
}