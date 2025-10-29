import { useEffect, useState } from 'react'
// import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Card from './components/Card'
import RouteContextLayout from './context/RouteContext'
import Cart from './components/Cart'
import Layout from './components/Layout'
import Checkout from './components/Checkout'
import { CartProvider } from './context/CartContext'
function App() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:5000/api/products")
      const data = await res.json()
      console.log(data)
      setProducts(data)
    }
    fetchData();
  }, [])


  return (
    <>
      <CartProvider>
        <BrowserRouter>


          <Routes>

            <Route element={<Layout />}>

                <Route index element={<Card item={products} />} />
                <Route path="cart" element={<Cart />}/>
                <Route path="checkout" element={<Checkout />} />
              </Route>

          </Routes>

        </BrowserRouter>
      </CartProvider>
      

    </>
  )
}

export default App
