import React, { useContext, useState } from "react";
import { useCart } from "../context/CartContext";
import { Outlet } from "react-router-dom";
import "./Card.css"
const Card = ({ item }) => {
    const { state, dispatch } = useCart();

    // const handleUpdateQuantity = (productId, newQuantity) => {
    //     dispatch({
    //         type: 'UPDATE_QUANTITY',
    //         payload: { productId, quantity: newQuantity },
    //     });
    // };
    const handleAddProduct = (productId, newQuantity) => {
        dispatch({
            type: 'ADD_PRODUCT',
            payload: { productId, quantity: newQuantity },
        });
        // console.log(state)
    };
    const handleRemoveProduct = (productId, newQuantity) => {
        dispatch({
            type: 'REMOVE_PRODUCT',
            payload: { productId, quantity: newQuantity },
        });
    };
    const handleReduceQuantity = (productId, newQuantity) => {
        dispatch({
            type: 'REDUCE_QUANTITY',
            payload: { productId, quantity: newQuantity },
        });
    };

    return (
        <div className="container">
            <div className="card_outer">
                {item.map((i) => (
                    <div key={i._id}>
                        <div className="card_text_holder">
                            {i.name}
                        </div>
                        <div className="card_action">
                            <div className="card_footer">
                                <button onClick={() => handleAddProduct(i._id, 1)} className="card_button">Add to Cart</button>
                            </div>
                            <div className="card_price">
                                {`Rs ${i.price}`}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Card;