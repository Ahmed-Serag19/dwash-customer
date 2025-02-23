import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";

interface UserAddress {
  userAddressId: number;
  cityAr: string;
  cityEn: string;
  districtAr: string;
  districtEn: string;
  latitude: string;
  longitude: string;
}

interface User {
  userAddressDto: any;
  id: number;
  username: string;
  email: string;
  mobile: string;
  nameAr: string;
  nameEn: string;
  userType: string;
  status: number;
  agreementAccept: number;
  userAddress?: UserAddress;
  cityId: string;
  districtId: string;
  latitude?: string;
  longitude?: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  cart: CartItem[] | null;
  getUser: () => Promise<void>;
  logout: () => void;
  getCart: () => Promise<void>;
}

interface CartItem {
  invoiceId: number;
  brandId: number;
  brandNameAr: string;
  brandNameEn: string;
  status: string;
  totalAmount: number;
  reviewed: boolean;
  item: {
    invoiceItemId: number;
    invoiceId: number;
    itemNameAr: string;
    itemNameEn: string;
    serviceTypeAr: string;
    serviceTypeEn: string;
    itemPrice: number;
    extras: {
      itemExtraId: number;
      itemExtraNameAr: string;
      itemExtraNameEn: string;
      invoiceItemId: number;
      itemExtraPrice: number;
    }[];
  };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem("accessToken")
  );
  const isAuthenticated = !!user && !!token;

  // Fetch User Data
  const getUser = async () => {
    if (!token) return;
    try {
      const response = await axios.get(apiEndpoints.getProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUser(response.data.content);
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
        setCart(response.data.content); // ✅ Store cart items
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

// Custom Hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
