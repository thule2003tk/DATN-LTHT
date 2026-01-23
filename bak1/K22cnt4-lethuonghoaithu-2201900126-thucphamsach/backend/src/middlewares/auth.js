const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "thucphamsach_secret";

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Chưa có token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token không hợp lệ" });
    req.user = decoded;
    next();
  });
}

function checkAdmin(req, res, next) {
  if (req.user.vai_tro !== "admin") return res.status(403).json({ error: "Không có quyền Admin" });
  next();
}

function checkCustomer(req, res, next) {
  if (req.user.vai_tro !== "customer") return res.status(403).json({ error: "Chỉ khách hàng mới được phép" });
  next();
}

module.exports = { verifyToken, checkAdmin, checkCustomer };
