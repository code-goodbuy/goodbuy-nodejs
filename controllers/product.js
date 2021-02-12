const Product = require("../models/product")

exports.getAllProducts = (req, res) => {
    const products = Product.find()
    .select("name brand corporation barcode state")
    .then(products => {
        res.status(200).json({products: products})
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res) => {
    const barcode = req.header('barcode')
    console.log(barcode)
    const product = Product.find({barcode: barcode})
    .then(product => {
        res.status(200).json({product: product})
    })
    .catch(err => console.log(err));
}

exports.createProduct =  (req, res) => {
    const product = new Product(req.body)
    product.save()
    .then(result => {
        res.status(200).json({
            product: result
        })
    })
};
