import mongoose, {Schema} from "mongoose";

const ProductSchema = new Schema({
    name: { type: String },
    price: { type: Number, min: 18, index: true }
});

const CartSchema = new Schema({
    cartId: { type: String },
    products: [
        {
            productId: String,
            quantity: Number,
            amount: Number
        }
    ],
    cartValue: { type: Number }
})

const CheckoutSchema = new Schema ({
    cartId: {type: String, ref: "Cart"},
    cart: [CartSchema],
    date: {type:Date, default: Date.now},
    email :{ type: String},
    name: {type: String}

}, { timestamps: true })

export const Product = mongoose.model("Product", ProductSchema);
export const Cart = mongoose.model("Cart", CartSchema);
export const Checkout = mongoose.model("Checkout", CheckoutSchema);