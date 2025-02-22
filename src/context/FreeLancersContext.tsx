import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { Freelancer } from "@/interfaces";

interface FreelancersContextType {
  freelancers: Freelancer[];
  size: number;
  fetchFreelancers: (size: number) => void;
  increaseSize: () => void;
}

const FreelancersContext = createContext<FreelancersContextType | undefined>(
  undefined
);

export const useFreelancers = () => {
  const context = useContext(FreelancersContext);
  if (!context) {
    throw new Error("useFreelancers must be used within a FreelancersProvider");
  }
  return context;
};

interface FreelancersProviderProps {
  children: ReactNode;
}

export const FreelancersProvider: React.FC<FreelancersProviderProps> = ({
  children,
}) => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [size, setSize] = useState(3); // Initial size is 3

  const fetchFreelancers = async (size: number) => {
    try {
      const response = await axios.get(apiEndpoints.getFreelancers(size));
      const data = response.data.content;
      setFreelancers(data.data); // Set fetched freelancers data
    } catch (error) {
      console.error("Error fetching freelancers", error);
    }
  };

  const increaseSize = () => {
    setSize((prev) => prev + 3); // Increase size by 3
  };

  useEffect(() => {
    fetchFreelancers(size);
  }, [size]);

  return (
    <FreelancersContext.Provider
      value={{ freelancers, size, fetchFreelancers, increaseSize }}
    >
      {children}
    </FreelancersContext.Provider>
  );
};
