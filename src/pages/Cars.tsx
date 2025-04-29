import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import CarForm from "@/components/cars/car-form";
import CarCard from "@/components/cars/car-card";
import EditCarModal from "@/components/cars/edit-car-modal";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import LoadingIndicator from "@/components/ui/loading-indicator";
import type { Car } from "@/interfaces";

export default function Cars() {
  const { token, cars, getCars, refreshUserData } = useUser();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [carToEdit, setCarToEdit] = useState<Car | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleAddCar = async (data: any) => {
    if (!token) {
      toast.error(t("notAuthenticated"));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(apiEndpoints.addCar, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(t("carAdded"));
        await getCars();
        await refreshUserData();
      } else {
        toast.error(t("addFailed"));
      }
    } catch (error) {
      console.error("Error adding car:", error);
      toast.error(t("generalError"));
    } finally {
      setLoading(false);
    }
  };

  const handleEditCar = async (carId: number, data: any) => {
    if (!token) {
      toast.error(t("notAuthenticated"));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(apiEndpoints.editCar(carId), data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(t("carUpdated"));
        await getCars();
        await refreshUserData();
      } else {
        toast.error(t("updateFailed"));
      }
    } catch (error) {
      console.error("Error updating car:", error);
      toast.error(t("generalError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async () => {
    if (!token || !carToDelete) {
      toast.error(t("notAuthenticated"));
      return;
    }

    setLoading(true);
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
        await getCars();
        await refreshUserData();
      } else {
        toast.error(t("deleteFailed"));
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error(t("generalError"));
    } finally {
      setLoading(false);
    }
  };

  if (loading && cars.length === 0) {
    return <LoadingIndicator message={t("loading")} />;
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-primary mb-8">
        {t("myCars")}
      </h2>

      {/* Add Car Form */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-6 text-primary">
          {t("addNewCar")}
        </h3>
        <CarForm onSubmit={handleAddCar} />
      </div>

      {/* Car List */}
      {cars.length > 0 && (
        <>
          <h3 className="text-2xl font-semibold mb-6 text-primary">
            {t("yourCars")}
          </h3>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {cars.map((car) => (
              <CarCard
                key={car.carId}
                car={car}
                onEdit={() => setCarToEdit(car)}
                onDelete={() => {
                  setCarToDelete(car);
                  setIsConfirmModalOpen(true);
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Edit Car Modal */}
      {carToEdit && (
        <EditCarModal
          isOpen={!!carToEdit}
          onClose={() => setCarToEdit(null)}
          car={carToEdit}
          onSave={handleEditCar}
        />
      )}

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
