const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "No name",
        min: 2,
        max: 50,
    },
    brand: {
        type: String,
        required: "No Brand error message",
        min: 2,
        max: 50,
    },
    corporation: {
        type: String,
        required: "No Corporation error message",
        min: 2,
        max: 50,
    },
    barcode: {
        type: String,
        required: "No Barcode error message",
        min: 4,
        max: 18,
    },
    state: {
        type: String,
        required: "No state",
        min: 3,
        max: 20,
    },
})

module.exports = mongoose.model("Product", productSchema);