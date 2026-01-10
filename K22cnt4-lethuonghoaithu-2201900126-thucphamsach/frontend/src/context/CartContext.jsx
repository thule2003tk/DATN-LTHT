import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 🔹 Load giỏ hàng từ localStorage
  useEffect(() => {
    if (isLoaded) return;

    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch (error) {
      console.error("Lỗi load giỏ hàng:", error);
      localStorage.removeItem("cart");
    } finally {
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // 🔹 Lưu giỏ hàng vào localStorage mỗi khi cart thay đổi
  useEffect(() => {
    if (isLoaded) localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, isLoaded]);

  // 🔹 Thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    // Chuẩn hóa img
    let imgUrl = product.img;
    if (imgUrl && !imgUrl.startsWith("http")) {
      imgUrl = `http://localhost:3001${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
    } else if (!imgUrl) {
      imgUrl = "https://via.placeholder.com/80"; // fallback nếu không có ảnh
    }

    setCart((prev) => {
      const exists = prev.find((p) => p.ma_sp === product.ma_sp);
      if (exists) {
        return prev.map((p) =>
          p.ma_sp === product.ma_sp
            ? { ...p, quantity: p.quantity + (product.quantity || 1) }
            : p
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1, img: imgUrl }];
    });
  };

  // 🔹 Cập nhật số lượng
  const updateCart = (ma_sp, quantity) => {
    if (quantity <= 0) {
      removeFromCart(ma_sp);
      return;
    }
    setCart((prev) =>
      prev.map((p) =>
        p.ma_sp === ma_sp ? { ...p, quantity: Number(quantity) } : p
      )
    );
  };

  // 🔹 Xóa sản phẩm
  const removeFromCart = (ma_sp) => {
    setCart((prev) => prev.filter((p) => p.ma_sp !== ma_sp));
  };

  // 🔹 Tổng số lượng và tổng tiền
  const cartCount = cart.reduce((sum, p) => sum + p.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, p) => sum + Number(p.gia) * p.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCart,
        removeFromCart,
        cartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook sử dụng
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
