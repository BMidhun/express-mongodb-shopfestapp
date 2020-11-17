const Product = require('../models/product');

const ITEM_PER_PAGE = 3;
class ProductService {

    static async postProduct(req) {
        try {
            const product = new Product({
                ...req.body,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: req.user._id
            });

            const result = await product.save();
            return result ? true : false;
        } catch (error) { console.log(error); return false }
    }

    static async getProductById(req, isEdit) {
        try {
            let product;
            if (!isEdit)
                product = await Product.findById(req.params.id);
            else
                product = await Product.findOne({ _id: req.params.id, createdBy: req.user._id })
            return product ? product : false;
        } catch (error) { return false }
    }

    static async getAllProducts(req, isAdmin) {
        try {
            let products
            const filter = isAdmin ? { createdBy: req.user._id } : {}

            const currentPage = parseInt(req.query.page);

            const totalproducts = await Product.find(filter).countDocuments();

            const totalpages = Math.ceil(totalproducts / ITEM_PER_PAGE);


            const hasPreviousPage = currentPage > 1;

            const hasNextPage = currentPage + 1 <= totalpages;

            products = await Product.find(filter).skip((currentPage - 1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE);

            return products ? { products, totalpages, hasPreviousPage, hasNextPage, currentPage } : false;
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async updateProduct(req) {
        try {
            const pid = req.body.productid;

            const updated_product = await Product.findOneAndUpdate({ _id: pid, createdBy: req.user._id }, {
                $set: {
                    pname: req.body.pname,
                    pdescription: req.body.pdescription,
                    purl: req.body.purl,
                    price: req.body.price
                }
            });

            return updated_product ? true : false;
        } catch (error) { console.log(error); return false; }
    }

    static async deleteProduct(req) {
        try {

            const pid = req.body.productid || req.params.id;
            const product = await Product.findOneAndDelete({ _id: pid, createdBy: req.user._id });
            return product ? true : false
        } catch (error) { console.log(error); return false }
    }

}


module.exports = ProductService;