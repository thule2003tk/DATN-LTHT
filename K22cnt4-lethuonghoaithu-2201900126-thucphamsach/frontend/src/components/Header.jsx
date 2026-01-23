import { Link, useNavigate } from "react-router-dom";
import {
  Container, Navbar, Nav, Form, InputGroup,
  Button, Badge, NavDropdown
} from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function Header({ searchTerm, setSearchTerm, categories }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      {/* ===== HEADER TOP ===== */}
      <Navbar bg="white" expand="lg" className="header-top shadow-sm sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="logo">
            Thực Phẩm Sạch
          </Navbar.Brand>

          <Form
            className="d-flex mx-auto header-search"
            style={{ maxWidth: "520px" }}
            onSubmit={handleSearch}
          >
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Tìm kiếm rau củ, thịt, trái cây..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="success" type="submit">
                Tìm
              </Button>
            </InputGroup>
          </Form>

          <Nav className="align-items-center gap-3">
            {user ? (
              <NavDropdown
                title={
                  <span className="fw-semibold">
                    Chào <strong>{user.hoten || user.ten_dangnhap}</strong>
                  </span>
                }
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <FaUser className="me-2" /> Hồ sơ
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/orders">
                  <FaShoppingCart className="me-2" /> Đơn hàng
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="text-danger"
                >
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="fw-semibold">
                  <FaUser /> Đăng nhập
                </Nav.Link>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-success"
                  className="btn-register"
                >
                  Đăng ký
                </Button>
              </>
            )}

            <Nav.Link as={Link} to="/cart" className="position-relative cart-icon">
              <FaShoppingCart size={24} />
              {cartCount > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle cart-badge"
                >
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* ===== NAV MENU ===== */}
      <Navbar bg="success" variant="dark" expand="lg" className="main-menu">
        <Container>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="mx-auto menu-links">
              <Nav.Link as={Link} to="/">Trang Chủ</Nav.Link>

              <NavDropdown title="Sản Phẩm" menuVariant="dark">
                {categories.map((cat) => (
                  <NavDropdown.Item
                    key={cat.title}
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

      {/* ===== CSS NHÚNG ===== */}
     <style>{`
/* ===== RESET NHẸ ===== */
.header-top, .main-menu {
  width: 100%;
}

/* ===== HEADER TOP ===== */
.header-top {
  padding: 10px 0;
}

.header-top .container {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* LOGO */
.logo {
  font-size: 26px;
  font-weight: 800;
  color: #2e7d32 !important;
  white-space: nowrap;
}

/* SEARCH */
.header-search {
  flex: 1;
  max-width: 520px;
}

.header-search input {
  height: 42px;
  border-radius: 999px 0 0 999px;
  padding-left: 18px;
}

.header-search button {
  height: 42px;
  border-radius: 0 999px 999px 0;
  padding: 0 24px;
  font-weight: 600;
}

/* USER + CART */
.header-top .nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-icon {
  color: #333 !important;
  transition: 0.25s;
}

.cart-icon:hover {
  color: #2e7d32 !important;
}

.cart-badge {
  font-size: 11px;
  font-weight: 700;
}

/* ===== MENU CHÍNH ===== */
.main-menu {
  background: linear-gradient(135deg, #2e7d32, #43a047) !important;
}

.main-menu .container {
  display: flex;
  justify-content: center;
}

/* MENU LINKS */
.menu-links {
  display: flex;
  align-items: center;
  gap: 40px;
}

.menu-links .nav-link {
  color: #ffffff !important;
  font-weight: 600;
  padding: 14px 0;
  position: relative;
  letter-spacing: 0.5px;
}

/* GẠCH CHÂN HOVER */
.menu-links .nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 6px;
  width: 0%;
  height: 2px;
  background: #c8e6c9;
  transition: 0.3s;
}

.menu-links .nav-link:hover::after {
  width: 100%;
}

/* DROPDOWN */
.dropdown-menu {
  border-radius: 14px;
  border: none;
  box-shadow: 0 12px 30px rgba(0,0,0,.2);
}

.dropdown-item {
  padding: 10px 16px;
  font-weight: 500;
}

.dropdown-item:hover {
  background: #e8f5e9;
  color: #2e7d32;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .header-top .container {
    flex-wrap: wrap;
  }

  .header-search {
    max-width: 100%;
    order: 3;
  }

  .menu-links {
    gap: 20px;
  }

  .menu-links .nav-link::after {
    display: none;
  }
}
`}</style>

    </>
  );
}

export default Header;
