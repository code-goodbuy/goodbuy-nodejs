const Product = require("../models/product")

exports.getProducts = (req, res) => {
    res.json({message: "YOUR PRODUCTS WILL BE DISPLAYED SOON or not"});
};

exports.createProduct =  (req, res) => {
    const product = new Product(req.body)
    product.save()
    .then(result => {
        res.status(200).json({
            product: result
        })
    })
};