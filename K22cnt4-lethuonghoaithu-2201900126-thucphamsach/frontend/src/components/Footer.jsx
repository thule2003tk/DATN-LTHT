{/* ===== FOOTER ===== */}
<footer className="site-footer">
  <Container>
    <Row className="gy-4">
      {/* CỘT 1 */}
      <Col lg={4} md={6}>
        <h4 className="footer-logo">Thực Phẩm Sạch</h4>
        <p className="footer-desc">
          Chuyên cung cấp rau củ – thịt – hải sản sạch đạt chuẩn VietGAP,
          an toàn cho sức khỏe gia đình Việt.
        </p>
        <div className="footer-social">
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaYoutube /></a>
        </div>
      </Col>

      {/* CỘT 2 */}
      <Col lg={3} md={6}>
        <h5 className="footer-title">Liên kết nhanh</h5>
        <ul className="footer-links">
          <li><Link to="/">Trang chủ</Link></li>
          <li><Link to="/products">Sản phẩm</Link></li>
          <li><Link to="/tin-tuc">Tin tức</Link></li>
          <li><Link to="/lien-he">Liên hệ</Link></li>
        </ul>
      </Col>

      {/* CỘT 3 */}
      <Col lg={3} md={6}>
        <h5 className="footer-title">Hỗ trợ khách hàng</h5>
        <ul className="footer-links">
          <li>Chính sách giao hàng</li>
          <li>Chính sách đổi trả</li>
          <li>Hướng dẫn mua hàng</li>
          <li>Câu hỏi thường gặp</li>
        </ul>
      </Col>

      {/* CỘT 4 */}
      <Col lg={2} md={6}>
        <h5 className="footer-title">Liên hệ</h5>
        <div className="footer-contact">
          <p><FaPhone /> 1900 1234</p>
          <p><FaEnvelope /> support@thucphamsach.vn</p>
          <p><FaMapMarkerAlt /> TP.HCM</p>
        </div>
      </Col>
    </Row>

    <hr className="footer-line" />

    <div className="footer-bottom">
      © 2026 Thực Phẩm Sạch – Tươi sạch mỗi ngày • VietGAP
    </div>
  </Container>
</footer>
