const user = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
module.exports = class UserService {


    static async registerUser(req) {

        try {

            const existingUser = await user.findOne({ email: req.body.email });

            if (existingUser)
                return { success: false, message: 'User with email address already exists! Please use another email address' }

            const hashedPassword = await bcrypt.hash(req.body.password, 12);

            const User = await new user({
                email: req.body.email,
                password: hashedPassword,
                name: req.body.username,
                cart: [],
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: '',
            });

            const result = await User.save()
            return result ? { success: true, message: null } : false;
        } catch (error) {
            console.log(error);
            return false
        }
    }

    static async findUserById(userid) {
        try {
            return await user.findById(userid);
        } catch (error) { return false }

    }

    static async verifyUser(email, password) {
        try {
            const userdata = await user.findOne({ email });
            const result = await bcrypt.compare(password, userdata.password);
            return result ? userdata : false;
        } catch (error) { console.log(error); return false }
    }

    static async resetPassword(req) {
        try {

            const userdata = req.user;
            const token = crypto.randomBytes(32).toString('hex');
            userdata.resetToken = token;
            userdata.tokenExpiry = Date.now() + 3600000
            const res = await userdata.save();
            return res ? token : false;

        } catch (error) { console.log(error); return false }
    }

    static async verifyUserToken(req) {

        try {

            const token = req.params.token;

            const userdata = await user.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });

            return userdata ? true : false;

        } catch (error) { return false }

    }

    static async changePassword(req) {

        try {
            const oldpass = req.body.old_password;
            const newpass = req.body.new_password;


            const token = req.body.token

            const userdata = await user.findOne({ resetToken: token });

            if (userdata) {

                const compare = await bcrypt.compare(oldpass, userdata.password)

                if (compare) {

                    const hashedPassword = await bcrypt.hash(newpass, 12);
                    userdata.password = hashedPassword;
                    const result = await userdata.save();
                    return result ? true : false;
                }
                else
                    return false;

            }

            else
                return false;


        } catch (error) { console.log(error); return false }
    }


    static async updateUser(req, imageUrl) {

        try {
            const userid = req.user._id;

            const res = await user.findByIdAndUpdate(userid, {
                $set: {
                    email: req.body.email,
                    profilepic: imageUrl ? imageUrl : req.user.profilepic,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    name: req.body.username,
                    address: req.body.address
                }
            });

            return res ? true : false;
        } catch (error) {
            return false;
        }


    }
}

