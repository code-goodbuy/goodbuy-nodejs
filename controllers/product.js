const Product = require("../models/product")

exports.getProducts = (req, res) => {
    res.json({message: "YOUR PRODUCTS WILL BE DISPLAYED SOON or not"});
};

exports.createProduct =  (req, res) => {
    const product = new Product(req.body)
    console.log("CREATING PRODUCT: ", req.body);
    product.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        return res.status(200).json({
            product: result
        });
    });
};