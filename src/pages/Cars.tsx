import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import CarForm from "@/components/cars/car-form";
import CarCard from "@/components/cars/car-card";
import EditCarModal from "@/components/cars/edit-car-modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CarIcon } from "lucide-react";
import type { Car } from "@/interfaces";

export default function Cars() {
  const { token, cars, getCars, refreshUserData } = useUser();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [carToEdit, setCarToEdit] = useState<Car | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";

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
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div
      className="container max-w-6xl mx-auto py-10 px-4 sm:px-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
          <div className="flex items-center gap-2">
            <CarIcon className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold text-primary">
              {t("myCars")}
            </CardTitle>
          </div>
          <CardDescription className="text-md font-semibold">
            {t("manageYourCars")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="cars" className="w-full py-2">
            <TabsList className="grid w-full grid-cols-2 mb-8 min-h-10">
              <TabsTrigger value="cars" className="text-md">
                {t("yourCars")}
              </TabsTrigger>
              <TabsTrigger value="add" className="text-md">
                {t("addNewCar")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cars" className="mt-4 space-y-6">
              {cars.length === 0 ? (
                <Alert variant="default" className="bg-muted/50">
                  <AlertDescription>{t("noCars")}</AlertDescription>
                </Alert>
              ) : (
                <div className="grid gap-4">
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
              )}
            </TabsContent>

            <TabsContent value="add" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <CarForm onSubmit={handleAddCar} isSubmitting={loading} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Car Modal */}
      {carToEdit && (
        <EditCarModal
          isOpen={!!carToEdit}
          onClose={() => setCarToEdit(null)}
          car={carToEdit}
          onSave={handleEditCar}
          isSubmitting={loading}
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
        title={t("confirmDelete")}
        message={t("confirmDeleteCarMessage")}
        confirmText={t("yes")}
        cancelText={t("no")}
        isSubmitting={loading}
        isRTL={isRTL}
      />
    </div>
  );
}
