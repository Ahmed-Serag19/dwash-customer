// Interface for Freelancer (Service Provider)
export interface Freelancer {
  brandId: number;
  brandNameAr: string;
  brandNameEn: string;
  brandDescriptionsAr: string | null;
  brandDescriptionsEn: string | null;
  brandLogo: string | null;
  brandBackgroundImage: string | null;
  avgAppraisal: number;
  available: boolean;
}

// Interface for Service
export interface Service {
  avgAppraisal: number;
  serviceId: number;
  brandId: number;
  brandNameAr: string;
  brandNameEn: string;
  servicesNameAr: string;
  servicesNameEn: string;
  servicesDescriptionsAr: string;
  servicesDescriptionsEn: string;
  servicesPrice: number;
  servicesTypeId: number;
  serviceTypeNameAr: string;
  serviceTypeNameEn: string;
  servicesStatus: number;
  serviceImages: { id: number; imagePath: string }[];
  extraServices: ExtraService[] | null;
}

// Interface for Extra Service
export interface ExtraService {
  id: number;
  extraNameAr: string;
  extraNameEn: string;
  extraDescriptionsAr: string;
  extraDescriptionsEn: string;
  extraPrice: number;
}

export interface UserAddress {
  userAddressId: number;
  cityAr: string;
  cityEn: string;
  districtAr: string;
  districtEn: string;
  latitude: string;
  longitude: string;
}

export interface User {
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

export interface UserContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  cart: CartItem[] | null;
  getUser: () => Promise<void>;
  logout: () => void;
  getCart: () => Promise<void>;
}

export interface CartItem {
  itemDto: any;
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
