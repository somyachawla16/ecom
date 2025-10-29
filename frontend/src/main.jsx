import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Card from './components/Card.jsx'
import Cart from './components/Cart.jsx'
import Checkout from './components/Checkout.jsx'
import RouteContextLayout from './context/RouteContext.jsx'
import Layout from './components/Layout.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>
)
