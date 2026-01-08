import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // thêm flag để tránh double load

  useEffect(() => {
    if (isLoaded) return; // nếu đã load rồi thì bỏ qua (fix StrictMode double call)

    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            setCart(parsed);
          }
        }
      } catch (error) {
        console.error("Lỗi load giỏ hàng:", error);
        localStorage.removeItem("cart");
      } finally {
        setIsLoaded(true); // đánh dấu đã load xong
      }
    };

    loadCart();
  }, [isLoaded]);

  // Lưu giỏ mỗi khi cart thay đổi
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.ma_sp === product.ma_sp);
      if (exists) {
        return prev.map((p) =>
          p.ma_sp === product.ma_sp
            ? { ...p, quantity: p.quantity + (product.quantity || 1) }
            : p
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

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

  const removeFromCart = (ma_sp) => {
    setCart((prev) => prev.filter((p) => p.ma_sp !== ma_sp));
  };

  const cartCount = cart.reduce((sum, p) => sum + p.quantity, 0);
  const totalPrice = cart.reduce((sum, p) => sum + Number(p.gia) * p.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateCart, removeFromCart, cartCount, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};