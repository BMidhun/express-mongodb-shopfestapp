const multer = require('multer');
const path = require('path');
const rootDir = require('./path')

exports.imageStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },

});

exports.imageFilter = (req, file, cb) => {
    console.log(file)
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
        cb(null, true);
    else {
        req.file = null;
        cb(null, false);
    }

}
