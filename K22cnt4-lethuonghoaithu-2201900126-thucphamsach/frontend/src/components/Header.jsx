import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Form,
  InputGroup,
  Button,
  Badge,
  NavDropdown,
} from "react-bootstrap";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaClipboardList,
  FaHome,
  FaLeaf,
  FaSeedling,
  FaAppleAlt,
  FaBoxOpen,
  FaPepperHot,
  FaFlask,
  FaNewspaper,
  FaPhoneAlt,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Header.css";

/* ================= CATEGORIES ================= */
const DEFAULT_CATEGORIES = [
  { title: "Rau Củ Quả", query: "rau-cu", icon: <FaSeedling /> },
  { title: "Đồ Khô", query: "do-kho", icon: <FaBoxOpen /> },
  { title: "Thực Phẩm Tươi", query: "tuoi-song", icon: <FaAppleAlt /> },
  { title: "Dược Liệu", query: "duoc-lieu", icon: <FaFlask /> },
  { title: "Hạt Giống", query: "hat-giong", icon: <FaLeaf /> },
  { title: "Chế Biến", query: "che-bien", icon: <FaPepperHot /> },
];

import { getCategoryIcon } from "../utils/iconHelper";

function Header({
  searchTerm = "",
  setSearchTerm = () => { },
}) {
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showProducts, setShowProducts] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Đồng bộ local state khi prop searchTerm thay đổi
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { getDanhMuc } = await import("../api/danhmuc");
        const data = await getDanhMuc();
        setDynamicCategories(data);
      } catch (err) {
        console.error("Header Category Load Error:", err);
      }
    };
    fetchCats();
  }, []);

  const categories = dynamicCategories.map(c => ({
    title: c.ten_danhmuc,
    query: c.ma_danhmuc,
    icon: getCategoryIcon(c.icon, c.ten_danhmuc)
  }));

  /* SEARCH */
  const handleSearch = (e) => {
    e.preventDefault();
    const term = localSearchTerm.trim();
    if (term) {
      navigate(`/products?search=${encodeURIComponent(term)}`);
    } else {
      navigate(`/products`); // Nếu rỗng thì xem tất cả
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sticky-header">
      {/* ================= HEADER TOP ================= */}
      <Navbar bg="white" expand="lg" className="header-top shadow-sm">
        <Container>
          {/* LOGO */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="logo d-flex align-items-center"
          >
            <img src="/images/logo.png" alt="HTFood" className="logo-img" />
            <span className="logo-text">Thực Phẩm Sạch HTFood</span>
          </Navbar.Brand>

          {/* SEARCH */}
          <Form
            className="d-flex mx-auto header-search"
            onSubmit={handleSearch}
          >
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Tìm rau củ, thịt, trái cây sạch..."
                value={localSearchTerm}
                onChange={(e) => {
                  setLocalSearchTerm(e.target.value);
                  setSearchTerm(e.target.value); // Cập nhật cho component cha nếu có (như trang Products)
                }}
              />
              <Button variant="success" type="submit">
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>

          {/* USER + CART */}
          <Nav className="align-items-center gap-3">
            {user ? (
              <NavDropdown
                align="end"
                show={showUser}
                onMouseEnter={() => setShowUser(true)}
                onMouseLeave={() => setShowUser(false)}
                title={
                  <span className="fw-semibold d-flex align-items-center gap-2">
                    <FaUser />
                    {user.hoten || user.ten_dangnhap}
                  </span>
                }
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <FaUser className="me-2" /> Hồ sơ
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/orders">
                  <FaClipboardList className="me-2" /> Đơn hàng
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item
                  className="text-danger fw-semibold"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <FaUser className="me-1" /> Đăng nhập
                </Nav.Link>
                <Button as={Link} to="/register" variant="outline-success">
                  Đăng ký
                </Button>
              </>
            )}

            <Nav.Link
              as={Link}
              to="/cart"
              className="cart-icon position-relative"
            >
              <FaShoppingCart size={22} />
              {cartCount > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* ================= MENU ================= */}
      <Navbar expand="lg" className="main-menu">
        <Container>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="mx-auto menu-links">
              <Nav.Link
                as={Link}
                to="/"
                active={isActive("/")}
                onClick={(e) => {
                  if (location.pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    // Let react-router handle the navigation, ScrollToTop will handle the scroll
                  }
                }}
              >
                <FaHome className="me-2" />
                Trang Chủ
              </Nav.Link>

              <NavDropdown
                show={showProducts}
                onMouseEnter={() => setShowProducts(true)}
                onMouseLeave={() => setShowProducts(false)}
                title={
                  <>
                    <FaLeaf className="me-2" />
                    Sản Phẩm
                  </>
                }
              >
                {categories.map((cat) => (
                  <NavDropdown.Item
                    key={cat.query}
                    as={Link}
                    to={`/products?category=${cat.query}`}
                    className="d-flex align-items-center gap-2"
                  >
                    <span className="text-success">{cat.icon}</span>
                    {cat.title}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <Nav.Link as={Link} to="/tin-tuc" active={isActive("/tin-tuc")}>
                <FaNewspaper className="me-2" />
                Tin Tức
              </Nav.Link>

              <Nav.Link as={Link} to="/lien-he">
                <FaPhoneAlt className="me-2" />
                Liên Hệ
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
