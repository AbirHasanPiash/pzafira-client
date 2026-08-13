import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Layout from "./components/Layout";
import Home from "./components/Home";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";
import { AdminPanelProvider } from "./admin/AdminPanelContext";

/**
 * Every route below the landing page is code-split.
 *
 * The home page ships in the initial bundle because it is the entry point for
 * most visitors; everything else — and in particular the chart-heavy admin
 * console — is fetched only when its route is first visited.
 */

// Auth
const Login = lazy(() => import("./auth/Login"));
const Register = lazy(() => import("./auth/Register"));
const Welcome = lazy(() => import("./auth/Welcome"));
const Activation = lazy(() => import("./auth/Activation"));
const PasswordResetConfirm = lazy(() => import("./auth/PasswordResetConfirm"));
const Dashboard = lazy(() => import("./auth/Dashboard"));

// Account
const UserProfile = lazy(() => import("./user/UserProfile"));
const ChangePassword = lazy(() => import("./user/ChangePassword"));

// Storefront
const Shop = lazy(() => import("./shop/Shop"));
const ProductDetails = lazy(() => import("./shop/ProductDetails"));
const CartItems = lazy(() => import("./shop/CartItems"));
const Wishlist = lazy(() => import("./shop/Wishlist"));
const AddressPage = lazy(() => import("./shop/AddressPage"));
const ManageAddress = lazy(() => import("./shop/ManageAddress"));
const OrderConfirmation = lazy(() => import("./shop/OrderConfirmation"));
const OrdersPage = lazy(() => import("./shop/OrdersPage"));
const PaymentSuccess = lazy(() => import("./shop/PaymentSuccess"));
const PaymentFail = lazy(() => import("./shop/PaymentFail"));
const PaymentCancel = lazy(() => import("./shop/PaymentCancel"));

// Informational pages
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Careers = lazy(() => import("./pages/Careers"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const FAQs = lazy(() => import("./pages/FAQs"));
const ShippingAndReturns = lazy(() => import("./pages/ShippingAndReturns"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin console
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const DashboardHome = lazy(() => import("./admin/DashboardHome"));
const TopUsers = lazy(() => import("./admin/TopUsers"));
const TopLikedProducts = lazy(() => import("./admin/TopLikedProducts"));
const ProductList = lazy(() => import("./admin/ProductList"));
const CreateProduct = lazy(() => import("./admin/CreateProduct"));
const ProductDetail = lazy(() => import("./admin/ProductDetail"));
const Brand = lazy(() => import("./admin/Brand"));
const Category = lazy(() => import("./admin/Category"));
const Color = lazy(() => import("./admin/Color"));
const Size = lazy(() => import("./admin/Size"));

const App = () => (
  <>
    <ScrollToTop />

    <Routes>
      {/* Every page renders inside the shared navbar/footer shell. */}
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route index element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="careers" element={<Careers />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="faqs" element={<FAQs />} />
        <Route path="shipping-and-returns" element={<ShippingAndReturns />} />
        <Route path="order-tracking" element={<OrderTracking />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="welcome" element={<Welcome />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="auth/activate/:uid/:token" element={<Activation />} />
        <Route
          path="password/reset/confirm/:uid/:token"
          element={<PasswordResetConfirm />}
        />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:id" element={<ProductDetails />} />

        {/* Payment gateway return routes */}
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="payment/fail" element={<PaymentFail />} />
        <Route path="payment/cancel" element={<PaymentCancel />} />

        {/* Requires a signed-in user */}
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
              <UserProfile />
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
          path="addresses"
          element={
            <ProtectedRoute>
              <AddressPage />
            </ProtectedRoute>
          }
        />
        {/* Kept so existing links and bookmarks to the old misspelling still work. */}
        <Route path="addreses" element={<Navigate to="/addresses" replace />} />
        <Route
          path="manage-addresses"
          element={
            <ProtectedRoute>
              <ManageAddress />
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

        {/* Requires a staff account */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPanelProvider>
                <AdminLayout />
              </AdminPanelProvider>
            </AdminRoute>
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

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>

    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      limit={3}
    />
  </>
);

export default App;
