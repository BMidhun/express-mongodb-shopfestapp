// This is where we define the logic of routing the user to a valid when the user attempts to enter a undefined route of the website
const path    = require('path');
const rootDir = require('../utils/path');

exports.PageNotFound = (req,res,next) => {
    // res.status(404).sendFile(path.join(__dirname,'views','404.html'));
    if(req.url === "/")
        return res.redirect('/shop')
    return res.sendFile(path.join(rootDir,'views','404.html'));
    // res.status(404).render('404');
}