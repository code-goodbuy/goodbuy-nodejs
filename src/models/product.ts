import mongoose from 'mongoose';
import IProduct from './product.interface'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "No name error message",
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
    ean: {
        type: Number,
        required: "No Ean error message"
    },
    state: {
        type: String,
        required: "No state error message",
        min: 3,
        max: 20,
    },
    created_at: {
        type: Date,
        required: "No timestamp",
    }
})

const ProductModel = mongoose.model<IProduct & mongoose.Document>('Product', productSchema);

export default ProductModel;