const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    pname: {
        type: String,
        required: true
    },

    purl: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    pdescription: {
        type: String,
        required: true
    },

    createdAt: {
        type: String,
        required: true
    },

    updatedAt: {
        type: String,
        required: true
    },

    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true
    }

})

const ProductModel = mongoose.model('product', productSchema);

module.exports = ProductModel;