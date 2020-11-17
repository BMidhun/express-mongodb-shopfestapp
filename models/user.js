const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: Array,
        required: true
    },
    firstname: String,
    profilepic: String,
    lastname: String,
    address: String,
    resetToken: String,
    tokenExpiry: Date
})

userSchema.methods.clearCart = function () {
    this.cart = [];
    this.save();
}


const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;