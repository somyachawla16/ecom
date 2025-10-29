import express from 'express';
import session from 'express-session'
import cookieSession from 'cookie-session';
import cors from 'cors';
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';
import connectDB from './database.js';
import { Product, Cart, Checkout } from './schema.js';
const app = express()



app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  httpOnly: false,
  cookie: {},
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/ecom-test"
  })
}))

// app.use(cookieSession({
//   name: 'session',
//   keys: ["Theiriehisioksngkjsnvniogibbuerqq[ujgsinvnwoin"],
//    httpOnly: false,
//   // Cookie Options
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }))

// const client = mongoose.connect("mongodb://localhost:27017/",{dbName:"ecom-test"}) 

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
connectDB();
mongoose.set('debug', true);


app.get("/api/products", async (req, res) => {
  // const product = client.model("Product", Product, "Product")
  const productList = await Product.find()
  console.log(productList)
  res.json(productList);
  // client.disconnect()
})



app.post("/api/cart", async (req, res) => {
  const { productId, quantity } = req.body;
  let cartId = req.sessionID
  const userId = "5de7ffa74fff640a0491bc4f"; //TODO: the logged in user id
  console.log(productId, quantity)
  // const cartId = req.sessionID;
  // const cartId = "Kq6CfMF4MIPva3IGTH7FVZERo_VVWM_P"
  // const cartId = req.sessionID
  try {
    const product = await Product.findById(productId)
    console.log(product)
    let cart = await Cart.findOne({ cartId: cartId });

    if (cart) {
      //cart exists for user
      let itemIndex = cart.products.findIndex(p => p.productId == productId);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];
        cart.cartValue -= productItem.amount
        productItem.quantity = quantity;
        productItem.amount = quantity * product.price
        cart.products[itemIndex] = productItem;
        cart.cartValue += productItem.amount;
      } else {
        //product does not exists in cart, add new item
        const amount = quantity * product.price
        cart.cartValue += amount
        cart.products.push({ productId, quantity, amount });
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      //no cart for user, create new cart
      const amount = quantity * product.price
      const cartValue = amount;
      console.log(`Product is ${product.name}, Price is ${product.price}, Quantity is ${quantity}`)

      const newCart = await Cart.create({
        cartId,
        products: [{ productId, quantity, amount }],
        cartValue
      });
      return res.status(201).json({ "cartId": newCart._id });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

app.delete("/api/cart/:id", async (req, res) => {
  const productId = req.params.id
  const cartId = req.sessionID
  let cart = await Cart.findOne({ "cartId": cartId })
  console.log(cart, 97)

  try {
    let itemIndex = cart.products.findIndex(p => p.productId == productId);
    console.log(itemIndex, 101)

    if (itemIndex > -1) {
      let productItem = cart.products[itemIndex];

      if (cart.cartValue - productItem.amount >= 0) {
        cart.cartValue -= productItem.amount
      }

      cart.products.splice(itemIndex, 1)
      if (cart.products.length === 0) {
        await Cart.deleteOne({ "cartId": cartId })
        return res.status(200).json("Deleted Successfully")

      }
      cart = await cart.save()
      return res.status(200).json("Updated Sucessfully")

    }
    else {
      return res.status(404).json("Nothing to Delete")
    }



  } catch (error) {
    console.log(error)
    res.status(500).json("Something went wrong")
  }

})

app.post("/api/checkout", async (req, res) => {
  const cartId = req.sessionID
  const { email, name } = req.body
  const cart = await Cart.findOne({ cartId: cartId })

  try {
    if (cart) {
      let checkout = new Checkout({
        cartId: cartId,
        cart: cart,
        email: email,
        name: name
      })
      const bill = await checkout.save()
      return res.status(200).json(bill)
    }
    else {
      return res.status(400).json("Please create cart first")
    }

  } catch (error) {
    console.log(error)
    res.status(500).json("Something went wront")
  }
})

app.get("/api/cart", async (req, res) => {
  const cartId = req.sessionID
  const items = await Cart.find({ "cartId": cartId })

  if(items) {
    return res.status(200).json(items)
  }
  else {
    return res.status(404).json({"message":"Cart is empty"})
  }

})

// app.post("/api/cart", async (req, res) => {
//   const sessionId = req.sessionID;
//   const data = req.body

//   console.log(data, sessionId)

//   const cartItemModel = new mongoose.model("CartItem", CartItem)
//   const newCartItem = new cartItemModel({productId: data.productId, quantity: data.qty})

//   const client = await mongoose.connect("mongodb://localhost:27017/",{dbName:"ecom-test"})  
//   const cart = client.model("Cart", Cart,"Cart")
//   const product = client.model("Product", Product, "Product")
//   const selectedProduct = await product.findById(data.productId)
//   newCartItem.amount = selectedProduct.price * data.qty
//   console.log(newCartItem)
//   const currentCart = await cart.findOne({"cartId":sessionId}).exec()

//   if (currentCart !== null) {
//     currentCart.productList.append(newCartItem)
//     currentCart.cartValue += newCartItem.amount
//     await currentCart.save()
//   }
//   else {
//     const cap = await 
//   res.json(cart)
//   client.disconnect()
// })

app.listen(5000);