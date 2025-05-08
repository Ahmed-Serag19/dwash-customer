import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import AddressCard from "./address-card";
import AddressModal from "./address-modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { UserAddress, AddressFormData } from "@/interfaces";
import { useUser } from "@/context/UserContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddressManagementProps {
  addresses: UserAddress[];
  token: string | null;
  onSuccess: () => void;
}

const AddressManagement = ({
  addresses,
  token,
  onSuccess,
}: AddressManagementProps) => {
  const { refreshUserData } = useUser();
  const { t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null
  );
  const [addressToDelete, setAddressToDelete] = useState<UserAddress | null>(
    null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAddress = async (data: AddressFormData) => {
    if (!token) {
      toast.error(t("notAuthenticated"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(apiEndpoints.addAddress, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(t("addressAdded"));
        setIsAddModalOpen(false);
        onSuccess();
        refreshUserData();
      } else {
        toast.error(t("addFailed"));
      }
    } catch (error) {
      toast.error(t("generalError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAddress = async (
    addressId: number,
    data: AddressFormData
  ) => {
    if (!token) {
      toast.error(t("notAuthenticated"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put(
        apiEndpoints.editAddress(addressId),
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(t("addressUpdated"));
        setEditingAddress(null);
        onSuccess();
        refreshUserData();
      } else {
        toast.error(t("updateFailed"));
      }
    } catch (error) {
      toast.error(t("generalError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!token || !addressToDelete) {
      toast.error(t("notAuthenticated"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.delete(
        apiEndpoints.deleteAddress(addressToDelete.userAddressId),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(t("addressDeleted"));
        setAddressToDelete(null);
        setIsConfirmModalOpen(false);
        onSuccess();
        refreshUserData();
      } else {
        toast.error(t("deleteFailed"));
      }
    } catch (error) {
      toast.error(t("generalError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirmation = (address: UserAddress) => {
    setAddressToDelete(address);
    setIsConfirmModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {addresses.length === 0 ? (
        <Alert variant="default" className="bg-muted/50">
          <AlertDescription>{t("noAddresses")}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.userAddressId}
              address={address}
              onEdit={() => setEditingAddress(address)}
              onDelete={() => openDeleteConfirmation(address)}
            />
          ))}
        </div>
      )}

      <Button
        onClick={() => setIsAddModalOpen(true)}
        className="w-full sm:w-auto"
        disabled={isSubmitting}
        variant="primary"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        {t("addAddress")}
      </Button>

      {/* Add Address Modal */}
      <AddressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t("addNewAddress")}
        onSubmit={handleAddAddress}
        isSubmitting={isSubmitting}
      />

      {/* Edit Address Modal */}
      {editingAddress && (
        <AddressModal
          isOpen={!!editingAddress}
          onClose={() => setEditingAddress(null)}
          title={t("editAddress")}
          initialData={{
            addressTitle: editingAddress.addressTitle,
            cityId: editingAddress.cityId,
            districtId: editingAddress.districtId,
            latitude: editingAddress.latitude,
            longitude: editingAddress.longitude,
          }}
          onSubmit={(data) =>
            handleEditAddress(editingAddress.userAddressId, data)
          }
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setAddressToDelete(null);
        }}
        onConfirm={handleDeleteAddress}
        title={t("confirmDeleteTitle")}
        message={t("confirmDeleteMessage")}
        confirmText={t("yes")}
        cancelText={t("no")}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddressManagement;
