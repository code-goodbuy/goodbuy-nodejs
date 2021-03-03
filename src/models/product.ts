import mongoose from "mongoose";

interface ProductSchemaType extends mongoose.Document {
	name: String;
	brand: String;
	corporation: String;
	barcode: String;
	state: String;
}

const productSchema: mongoose.Schema = new mongoose.Schema({
	name: {
		type: String,
		required: "No name",
		min: 2,
		max: 50
	},
	brand: {
		type: String,
		required: "No Brand error message",
		min: 2,
		max: 50
	},
	corporation: {
		type: String,
		required: "No Corporation error message",
		min: 2,
		max: 50
	},
	barcode: {
		type: String,
		required: "No Barcode error message",
		min: 4,
		max: 18
	},
	state: {
		type: String,
		required: "No state",
		min: 3,
		max: 20
	}
});

const Product: mongoose.Model<ProductSchemaType> = mongoose.model("Product", productSchema);
export { productSchema };
export default Product;
