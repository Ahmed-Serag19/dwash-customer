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
