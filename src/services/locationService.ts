import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import type { City, District } from "@/interfaces";

export const fetchCities = async (): Promise<City[]> => {
  try {
    const response = await axios.get(apiEndpoints.getCities);
    if (response.data.success) {
      return response.data.content;
    }
    return [];
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

export const fetchDistricts = async (cityId: number): Promise<District[]> => {
  try {
    const response = await axios.get(apiEndpoints.getDistrict(cityId));
    if (response.data.success) {
      return response.data.content;
    }
    return [];
  } catch (error) {
    console.error("Error fetching districts:", error);
    return [];
  }
};
