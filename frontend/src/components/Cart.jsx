import React, { useContext, useEffect, useState } from "react";
import { useCart } from '../context/CartContext';
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import "./Cart.css"


const Cart = () => {
  const { state, dispatch } = useCart()
  const [cartItem, setCartItems] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:5000/api/cart", {
      method: "GET",
      "credentials": "include"
    }).then(e => e.json()).then(e => setCartItems(n => [...e])).catch(e => console.log(e))
  }, [state])

  const handleUpdateQuantity = (productId, newQuantity) => {
    const data = { "productId": productId, "quantity": newQuantity };
    fetcher("http://localhost:5000/api/cart", data);
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity: newQuantity },
    });
  };

  function fetcher(url, data) {
    fetch(url, {
      body: JSON.stringify(data),
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(e => { console.log(e) })
      .catch(e => console.log(e))
  }

  return (
    <div className="cart_container">
      <div className="cart_list">
        {cartItem && cartItem[0].products.map((value, index) => (
          <div key={index} className="cart_item">
            <p className="cart_line">
              <span className="cart_product_id">{value._id}</span> :
              <button
                className="quantity_btn sub_btn"
                onClick={() => handleUpdateQuantity(value.productId, value.quantity - 1)}
              >
                Sub
              </button>
              <span className="quantity_value">{value.quantity}</span>
              <button
                className="quantity_btn add_btn"
                onClick={() => handleUpdateQuantity(value.productId, value.quantity + 1)}
              >
                Add
              </button>
            </p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/checkout")}>Checkout </button>

    </div>

  );
};

export default Cart;