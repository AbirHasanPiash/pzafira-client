import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./auth/AuthProvider";
import { ToastContainer } from "react-toastify";

import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./auth/Dashboard";
import PasswordResetConfirm from "./auth/PasswordResetConfirm";
import Activation from "./auth/Activation";
import Welcome from "./auth/Welcome";
import ProtectedRoute from "./auth/ProtectedRoute";
import Shop from "./Shop/Shop";
import ProductDetails from "./shop/ProductDetails";
import CartItems from "./shop/CartItems";
import Wishlist from "./shop/Wishlist";
import OrderConfirmation from "./shop/OrderConfirmation";
import PaymentSuccess from "./shop/PaymentSuccess";
import PaymentFail from "./shop/PaymentFail";
import PaymentCancel from "./shop/PaymentCancel";
import OrdersPage from "./shop/OrdersPage";
import AdminLayout from "./admin/AdminLayout";
import { AdminPanelProvider } from "./admin/AdminPanelContext";
import DashboardHome from "./admin/DashboardHome";
import TopUsers from "./admin/TopUsers";
import TopLikedProducts from "./admin/TopLikedProducts";
import Brand from "./admin/Brand";
import Category from "./admin/Category";
import Color from "./admin/Color";
import Size from "./admin/Size";
import ProductList from "./admin/ProductList";
import CreateProduct from "./admin/CreateProduct";
import ProductDetail from "./admin/ProductDetail";
import UserProfile from "./user/UserProfile";
import ChangePassword from "./user/ChangePassword";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Routes>
        {/* All pages will be inside Layout */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="password/reset/confirm/:uid/:token"
            element={<PasswordResetConfirm />}
          />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="auth/activate/:uid/:token" element={<Activation />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:id" element={<ProductDetails />} />

          {/* Protected Routes */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <UserProfile/>
              </ProtectedRoute>
            }
          />
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <CartItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="confirm-order"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <AdminPanelProvider>
                <AdminLayout />
              </AdminPanelProvider>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="top-users" element={<TopUsers />} />
            <Route path="top-products" element={<TopLikedProducts />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="brands" element={<Brand />} />
            <Route path="categories" element={<Category />} />
            <Route path="colors" element={<Color />} />
            <Route path="sizes" element={<Size />} />
            <Route path="order-history" element={<OrdersPage />} />
          </Route>
          <Route path="payment/success" element={<PaymentSuccess />} />
          <Route path="payment/fail" element={<PaymentFail />} />
          <Route path="payment/cancel" element={<PaymentCancel />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default App;
