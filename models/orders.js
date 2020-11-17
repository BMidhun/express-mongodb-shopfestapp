const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    createdAt : {
        type : String,
        required : true
    },
    totalamount : {
        type: Number,
        required : true
    },
    products : {
        type: Array,
        required : true
    },
    userid : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required : true
    }
});


const orderModel = mongoose.model('order',orderSchema);

module.exports = orderModel;