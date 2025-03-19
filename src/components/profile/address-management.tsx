import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import AddressCard from "./address-card";
import AddressModal from "./address-modal";
import ConfirmationModal from "./confirmation-modal";
import type { UserAddress, AddressFormData } from "@/interfaces";

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
  const { t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null
  );
  const [addressToDelete, setAddressToDelete] = useState<UserAddress | null>(
    null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleAddAddress = async (data: AddressFormData) => {
    if (!token) {
      toast.error(t("notAuthenticated"));
      return;
    }

    try {
      const response = await axios.post(apiEndpoints.addAddress, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(t("addressAdded"));
        setIsAddModalOpen(false);
        onSuccess();
      } else {
        toast.error(t("addFailed"));
      }
    } catch (error) {
      toast.error(t("generalError"));
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
      } else {
        toast.error(t("updateFailed"));
      }
    } catch (error) {
      toast.error(t("generalError"));
    }
  };

  const handleDeleteAddress = async () => {
    if (!token || !addressToDelete) {
      toast.error(t("notAuthenticated"));
      return;
    }

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
      } else {
        toast.error(t("deleteFailed"));
      }
    } catch (error) {
      toast.error(t("generalError"));
    }
  };

  const openDeleteConfirmation = (address: UserAddress) => {
    setAddressToDelete(address);
    setIsConfirmModalOpen(true);
  };

  return (
    <div>
      {/* Address List */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {addresses.map((address) => (
          <AddressCard
            key={address.userAddressId}
            address={address}
            onEdit={() => setEditingAddress(address)}
            onDelete={() => openDeleteConfirmation(address)}
          />
        ))}
      </div>

      {/* Add Address Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="bg-primary text-white px-4 py-2 rounded-lg"
      >
        {t("addAddress")}
      </button>

      {/* Add Address Modal */}
      <AddressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t("addNewAddress")}
        onSubmit={handleAddAddress}
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
      />
    </div>
  );
};

export default AddressManagement;
