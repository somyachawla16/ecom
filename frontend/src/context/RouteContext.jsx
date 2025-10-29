import { Outlet } from 'react-router-dom';
import { CartProvider } from './CartContext';

const RouteContextLayout = () => {

  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  );
};

export default RouteContextLayout;