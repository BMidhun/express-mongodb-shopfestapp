const orderModel = require("../models/orders");
const ProductModel = require("../models/product");
const UserModel = require("../models/user");


module.exports = class OrderServices {

    static async registerOrder(req) {

        try {

            const cart = req.user.cart;
            let totalamount = 0
            const pids = cart.map(p => p.productid)
            let products = await ProductModel.find({ _id: { $in: pids } });

            products = products.map(p => {
                const product = p.toObject();
                const qty = cart.find(item => item.productid.toString() === product._id.toString()).qty;
                totalamount += p.price
                return { ...product, qty }
            })

            let order = {
                createdAt: new Date(),
                totalamount,
                products,
                userid: req.user._id
            }

            order = new orderModel(order);
            const result = await order.save();

            if (result) {
                // const userid = req.user._id
                req.user.clearCart();
                // await UserModel.findByIdAndUpdate(userid,{cart:[]});
            }

            return result ? order : false;

        } catch (error) { console.log(error); return false }
    }


    static async displayOrder(req) {

        try {

            const userid = req.user._id;
            const orders = await orderModel.find({ userid });
            return orders ? orders : false;

        } catch (error) { return false; }
    }

    static async getOrderofUser(req) {
        try {

            const userid = req.user._id

            const orders = await orderModel.find({ _id: req.params.orderid, userid });

            return orders ? orders[0] : false;

        } catch (error) {
            console.log(error)
            return false;
        }
    }

}