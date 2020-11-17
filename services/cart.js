const Product = require('../models/product');
const User = require('../models/user');
class CartService {

    static async displayCart(req) {

        try {
            const cart = req.user.cart;
            let totalamount = 0;
            let result;
            if (cart.length) {
                const productids = cart.map(p => p.productid);
                const cartitems = await Product.find({ _id: { $in: productids } });
                result = cartitems.map(item => {
                    const citem = item.toObject();
                    const price = parseFloat(citem.price);
                    const qty = cart.find(p => p.productid.toString() === citem._id.toString()).qty
                    totalamount += (price * qty);
                    return { ...citem, price, qty };

                });
            }
            return result ? { cartitems: result, totalamount } : false;
        } catch (error) { console.log(error); return false }



    }

    static async addToCart(req) {

        try {
            const prodId = req.body.productid;
            const cart = req.user.cart;
            // console.log(req.user);
            if (cart.length) {
                const existingProduct = cart.findIndex(cartitem => {
                    return cartitem.productid.toString() === prodId.toString();
                });
                if (existingProduct !== -1)
                    cart[existingProduct].qty += 1;
                else
                    cart.push({ productid: prodId, qty: 1 });
            }

            else
                cart.push({ productid: prodId, qty: 1 });

            const result = await req.user.updateOne({ cart });
            return result ? true : false;

        } catch (error) { console.log(error); return false }

    }


    static async deleteCartItem(req) {

        try {

            const prodId = req.body.productid;
            const cart = req.user.cart.filter(item => item.productid.toString() !== prodId.toString());
            const result = await req.user.updateOne({ cart });
            return result ? true : false;
        } catch (error) { console.log(error); return false }

    }

}

module.exports = CartService