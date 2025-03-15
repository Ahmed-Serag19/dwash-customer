import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { UserContextType, User, CartItem } from "@/interfaces";
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem("accessToken")
  );
  const isAuthenticated = !!user && !!token;

  const getUser = async () => {
    const storedToken = sessionStorage.getItem("accessToken"); // ✅ Fetch latest token from session storage
    if (!storedToken) return;

    try {
      const response = await axios.get(apiEndpoints.getProfile, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (response.data.success) {
        setUser(response.data.content);
        setToken(storedToken); // ✅ Update token state immediately
      } else {
        console.error("Error fetching user:", response.data.messageEn);
        logout();
      }
    } catch (error) {
      console.error("Failed to get user:", error);
      logout();
    }
  };

  const getCart = async () => {
    if (!token) return;
    try {
      const response = await axios.get(apiEndpoints.getCart, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCart(response.data.content);
      } else {
        console.error("Error fetching cart:", response.data.messageEn);
      }
    } catch (error) {
      console.error("Failed to get cart:", error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      getUser();
      getCart();
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{ user, token, isAuthenticated, getUser, logout, cart, getCart }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
