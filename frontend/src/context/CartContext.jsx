import { useReducer, useContext, createContext, act, useState } from "react";

const CartContext = createContext();
const initialState = [];

const reducer = (state, action) => {

  switch (action.type) {
    case 'UPDATE_QUANTITY':


        return state.map(product =>
        product.productId === action.payload.productId
          ? { ...product, quantity: action.payload.quantity }
          : product
      );
    case 'ADD_PRODUCT':
      let index = state.findIndex((p, i) => (p.productId === action.payload.productId))
      if (index > -1) {
        return state;
      } else {
        fetch("http://localhost:5000/api/cart", {
          body: JSON.stringify(action.payload),
          method: "POST",
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(res => res.json())
          .then(e => {
            console.log(e);
          })
          .catch(e => console.log(e))
        return [...state, action.payload]
      }


    case 'REMOVE_PRODUCT':
      return state.filter(product => product.productId !== action.payload.productId); 

    case 'POPULATE_FROM_DB':
      return [action.payload]

    default:
      return state;
  }
};




export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  return useContext(CartContext)
}


