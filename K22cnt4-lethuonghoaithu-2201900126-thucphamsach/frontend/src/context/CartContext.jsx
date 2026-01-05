import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.ma_sp === product.ma_sp);
      if (exists) {
        return prev.map((p) =>
          p.ma_sp === product.ma_sp
            ? { ...p, quantity: p.quantity + (product.quantity || 1) }
            : p
        );
      } else {
        return [...prev, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  const updateCart = (ma_sp, quantity) => {
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
  const totalPrice = cart.reduce(
    (sum, p) => sum + Number(p.gia) * p.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateCart, removeFromCart, cartCount, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
