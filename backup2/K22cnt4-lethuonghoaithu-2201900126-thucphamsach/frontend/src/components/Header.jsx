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
      {/* HEADER TOP */}
      <Navbar bg="white" expand="lg" className="shadow-sm py-3 sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-success fs-3">
            Thực Phẩm Sạch
          </Navbar.Brand>

          <Form className="d-flex mx-auto" style={{ maxWidth: "500px" }} onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="success" type="submit">Tìm</Button>
            </InputGroup>
          </Form>

          <Nav className="align-items-center gap-3">
            {user ? (
              <NavDropdown
                title={
                  <span className="text-dark fw-medium">
                    Chào <strong>{user.hoten || user.ten_dangnhap}</strong> 🌿
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
                <Nav.Link as={Link} to="/login">
                  <FaUser /> Đăng nhập
                </Nav.Link>
                <Button as={Link} to="/register" variant="outline-success">
                  Đăng ký
                </Button>
              </>
            )}

            <Nav.Link as={Link} to="/cart" className="position-relative">
              <FaShoppingCart size={26} />
              {cartCount > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* NAV MENU */}
      <Navbar bg="success" variant="dark" expand="lg" className="py-0 shadow-sm">
        <Container>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="mx-auto fw-semibold text-uppercase gap-5">
              <Nav.Link as={Link} to="/" className="py-3">Trang Chủ</Nav.Link>

              <NavDropdown title="Sản Phẩm" menuVariant="dark">
                {categories.map(cat => (
                  <NavDropdown.Item
                    key={cat.title}
                    as={Link}
                    to={`/products?category=${cat.query}`}
                  >
                    {cat.title}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <Nav.Link as={Link} to="/tin-tuc" className="py-3">Tin Tức</Nav.Link>
              <Nav.Link as={Link} to="/lien-he" className="py-3">Liên Hệ</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
