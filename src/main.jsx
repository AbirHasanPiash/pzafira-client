import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import { CartProvider } from "./shop/CartContext.jsx";
import { WishlistProvider } from "./shop/WishlistContext.jsx";
import { OrdersProvider } from "./shop/OrdersContext.jsx";
import SWRProvider from "./SWRProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SWRProvider>
          <CartProvider>
            <WishlistProvider>
              <OrdersProvider>
                <App />
              </OrdersProvider>
            </WishlistProvider>
          </CartProvider>
        </SWRProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
