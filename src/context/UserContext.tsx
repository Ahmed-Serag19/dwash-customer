import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { UserContextType, User, CartItem, Car } from "@/interfaces";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user && !!token;

  const refreshUserData = async () => {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(apiEndpoints.getProfile, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (response.data.success) {
        setUser(response.data.content);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  const getUser = async () => {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(apiEndpoints.getProfile, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (response.data.success) {
        setUser(response.data.content);
        setToken(storedToken);
      } else {
        console.error("Error fetching user:", response.data.messageEn);
        logout();
      }
    } catch (error) {
      console.error("Failed to get user:", error);
      logout();
    } finally {
      setLoading(false); // ✅ done either way
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

  const getCars = async () => {
    if (!token) return;
    try {
      const response = await axios.get(apiEndpoints.getAllCars, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCars(response.data.content || []);
      } else {
        console.error("Error fetching cars:", response.data.messageEn);
      }
    } catch (error) {
      console.error("Failed to get cars:", error);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setToken(null);
    setUser(null);
    setCart(null);
    setCars([]);
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      getUser(); // will set loading=false inside
      getCart();
      getCars();
    } else {
      setLoading(false); // no token = done
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const loginTime = parseInt(localStorage.getItem("loginTime") || "0", 10);
      const currentTime = Date.now();
      const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

      if (currentTime - loginTime >= sessionDuration) {
        logout();
      } else {
        const logoutTimer = setTimeout(() => {
          logout();
        }, sessionDuration - (currentTime - loginTime));

        return () => clearTimeout(logoutTimer);
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        getUser,
        logout,
        cart,
        getCart,
        cars,
        getCars,
        refreshUserData,
        loading, // ✅ return it
      }}
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
