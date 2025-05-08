
import { useEffect } from "react";
import AddressForm from "./address-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AddressFormData } from "@/interfaces";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData?: AddressFormData;
  onSubmit: (data: AddressFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const AddressModal = ({
  isOpen,
  onClose,
  title,
  initialData,
  onSubmit,
  isSubmitting = false,
}: AddressModalProps) => {
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose, isSubmitting]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => !open && !isSubmitting && onClose()}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <AddressForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
