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
  FaHeart,
  FaClipboardList,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

/* ================= DEFAULT CATEGORIES (AN TOÀN) ================= */
const DEFAULT_CATEGORIES = [
  { title: "Rau Củ Quả", query: "rau-cu" },
  { title: "Đồ Khô", query: "do-kho" },
  { title: "Thực Phẩm Tươi", query: "tuoi-song" },
  { title: "Dược Liệu", query: "duoc-lieu" },
  { title: "Hạt Giống", query: "hat-giong" },
  { title: "Chế Biến", query: "che-bien" },
];

function Header(props) {
  const {
    searchTerm = "",
    setSearchTerm = () => {},
    categories = DEFAULT_CATEGORIES, // ⭐ FIX CỐT LÕI
  } = props;

  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= SEARCH ================= */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ===== HEADER TOP ===== */}
      <Navbar bg="white" expand="lg" className="header-top shadow-sm sticky-top">
        <Container>
          {/* LOGO */}
          <Navbar.Brand as={Link} to="/" className="logo">
            🥬 Thực Phẩm Sạch
          </Navbar.Brand>

          {/* SEARCH */}
          <Form className="d-flex mx-auto header-search" onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Tìm rau củ, thịt, trái cây sạch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                title={<span className="fw-semibold">👋 {user.hoten || user.ten_dangnhap}</span>}
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <FaUser className="me-2" /> Hồ sơ
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/orders">
                  <FaClipboardList className="me-2" /> Đơn hàng
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/wishlist">
                  <FaHeart className="me-2 text-danger" /> Yêu thích
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
                  <FaUser /> Đăng nhập
                </Nav.Link>
                <Button as={Link} to="/register" variant="outline-success">
                  Đăng ký
                </Button>
              </>
            )}

            <Nav.Link as={Link} to="/cart" className="cart-icon position-relative">
              <FaShoppingCart size={24} />
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

      {/* ===== MENU ===== */}
      <Navbar expand="lg" className="main-menu">
        <Container>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="mx-auto menu-links">
              <Nav.Link as={Link} to="/" active={isActive("/")}>
                Trang Chủ
              </Nav.Link>

              <NavDropdown title="Sản Phẩm">
                {(categories || DEFAULT_CATEGORIES).map((cat) => (
                  <NavDropdown.Item
                    key={cat.query}
                    as={Link}
                    to={`/products?category=${cat.query}`}
                  >
                    {cat.title}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <Nav.Link as={Link} to="/tin-tuc">Tin Tức</Nav.Link>
              <Nav.Link as={Link} to="/lien-he">Liên Hệ</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ===== CSS ===== */}
      <style>{`
        .logo { font-size:26px;font-weight:800;color:#2e7d32!important }
        .header-search { flex:1;max-width:520px }
        .main-menu { background:linear-gradient(135deg,#2e7d32,#43a047) }
        .menu-links { gap:36px }
        .menu-links .nav-link { color:#fff!important;font-weight:600 }
        .cart-icon { color:#333 }
        .cart-icon:hover { color:#2e7d32 }
      `}</style>
    </>
  );
}

export default Header;
