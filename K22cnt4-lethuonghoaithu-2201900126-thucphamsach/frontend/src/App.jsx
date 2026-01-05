import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import TinTuc from "./pages/TinTuc";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/Dashboard";
import AdminProducts from "./admin/Products";
import AdminOrders from "./admin/Orders";
import AdminCustomers from "./admin/Customers";
import AdminSuppliers from "./admin/Suppliers";
import AdminPromotions from "./admin/Promotions";
import AdminContacts from "./admin/Contacts";
import AdminUsers from "./admin/Users";

import AdminRoute from "./admin/AdminRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; // ✅ thêm CartProvider

function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* ✅ bọc CartProvider quanh toàn bộ Router */}
        <Router>
          <Routes>
            {/* USER */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/tin-tuc" element={<TinTuc />} />

            {/* ADMIN */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="suppliers" element={<AdminSuppliers />} />
              <Route path="promotions" element={<AdminPromotions />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
