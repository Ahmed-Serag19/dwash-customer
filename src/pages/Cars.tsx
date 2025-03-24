import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import CarForm from "@/components/cars/car-form";
import CarCard from "@/components/cars/car-card";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import LoadingIndicator from "@/components/ui/loading-indicator";
import type { Car } from "@/interfaces";

export default function Cars() {
  const { token } = useUser();
  const { t } = useTranslation();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Fetch all cars on component mount
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(apiEndpoints.getAllCars, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCars(response.data.content || []);
      } else {
        toast.error(t("failedToLoadCars"));
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error(t("generalError"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = async (data: any) => {
    if (!token) {
      toast.error(t("notAuthenticated"));
      return;
    }

    try {
      const response = await axios.post(apiEndpoints.addCar, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(t("carAdded"));
        fetchCars();
      } else {
        toast.error(t("addFailed"));
      }
    } catch (error) {
      console.error("Error adding car:", error);
      toast.error(t("generalError"));
    }
  };

  const handleEditCar = async (carId: number, data: any) => {
    if (!token) {
      toast.error(t("notAuthenticated"));
      return;
    }

    try {
      const response = await axios.put(apiEndpoints.editCar(carId), data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(t("carUpdated"));
        setEditingCar(null);
        fetchCars();
      } else {
        toast.error(t("updateFailed"));
      }
    } catch (error) {
      console.error("Error updating car:", error);
      toast.error(t("generalError"));
    }
  };

  const handleDeleteCar = async () => {
    if (!token || !carToDelete) {
      toast.error(t("notAuthenticated"));
      return;
    }

    try {
      const response = await axios.delete(
        apiEndpoints.deleteCar(carToDelete.carId),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(t("carDeleted"));
        setCarToDelete(null);
        setIsConfirmModalOpen(false);
        fetchCars();
      } else {
        toast.error(t("deleteFailed"));
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error(t("generalError"));
    }
  };

  const openDeleteConfirmation = (car: Car) => {
    setCarToDelete(car);
    setIsConfirmModalOpen(true);
  };

  if (loading && cars.length === 0) {
    return <LoadingIndicator message={t("loading")} />;
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-primary mb-8">
        {t("myCars")}
      </h2>

      {/* Car Form */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-6 text-primary">
          {t("addNewCar")}
        </h3>
        <CarForm
          onSubmit={handleAddCar}
          editingCar={editingCar}
          onEdit={(carId, data) => handleEditCar(carId, data)}
          onCancelEdit={() => setEditingCar(null)}
        />
      </div>

      {/* Car List */}
      {cars.length > 0 && (
        <h3 className="text-2xl font-semibold mb-6 text-primary">
          {t("yourCars")}
        </h3>
      )}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {cars.map((car) => (
          <CarCard
            key={car.carId}
            car={car}
            onEdit={() => setEditingCar(car)}
            onDelete={() => openDeleteConfirmation(car)}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setCarToDelete(null);
        }}
        onConfirm={handleDeleteCar}
        title={t("confirmDeleteTitle")}
        message={t("confirmDeleteCarMessage")}
        confirmText={t("yes")}
        cancelText={t("no")}
      />
    </div>
  );
}
