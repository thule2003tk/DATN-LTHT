import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import TinTuc from "./pages/TinTuc";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import BlogDetail from "./pages/BlogDetail";
import ThanhToan from "./pages/ThanhToan";
import LienHe from "./pages/LienHe";
import NewsDetail from "./pages/NewsDetail";
import Blog from "./pages/Blog";


// ADMIN
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/Dashboard";
import AdminDanhMuc from "./admin/DanhMucAdmin";
import AdminProducts from "./admin/Products";
import AdminOrders from "./admin/AdminOrders";
import AdminCustomers from "./admin/Customers";
import AdminSuppliers from "./admin/Suppliers";
import AdminPromotions from "./admin/Promotions";
import AdminContacts from "./admin/Contacts";
import AdminUsers from "./admin/Users";
import AdminBlog from "./admin/AdminBlog";
import AdminBanners from "./admin/Banners";
import NewsManager from "./admin/NewsManager";
import AdminRoute from "./admin/AdminRoute";
import ProductAdd from "./admin/ProductAdd";
import ProductEdit from "./admin/ProductEdit";
import AdminNotifications from "./admin/AdminNotifications";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import DonViTinhAdmin from "./admin/DonViTinhAdmin";
import DonViSanPhamAdmin from "./admin/DonViSanPhamAdmin";
import FestiveEffect from "./components/FestiveEffect";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FestiveEffect />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>

            {/* USER ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/tin-tuc" element={<TinTuc />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/thanhtoan" element={<ThanhToan />} />
            <Route path="/lien-he" element={<LienHe />} />
            <Route path="/blog" element={<Blog />} />
            {/* BLOG DETAIL */}
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/tin-tuc/:id" element={<NewsDetail />} />

            {/* ADMIN ROUTES */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="suppliers" element={<AdminSuppliers />} />
              <Route path="promotions" element={<AdminPromotions />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="news" element={<NewsManager />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="products/add" element={<ProductAdd />} />
              <Route path="products/edit/:id" element={<ProductEdit />} />
              <Route path="danhmuc" element={<AdminDanhMuc />} />
              <Route path="donvitinh" element={<DonViTinhAdmin />} />
              <Route path="donvisanpham" element={<DonViSanPhamAdmin />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
