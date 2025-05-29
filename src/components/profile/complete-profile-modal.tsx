import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PersonalInfoForm from "./personal-info-form";
import { useUser } from "@/context/UserContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CompleteProfileModal: React.FC<Props> = ({ open, onClose }) => {
  const { user, token, refreshUserData } = useUser();

  if (!user || !token) return null;

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">
            يرجى استكمال بياناتك الشخصية
          </DialogTitle>
        </DialogHeader>

        <PersonalInfoForm
          user={user}
          token={token}
          onSuccess={() => {
            refreshUserData(); // Refresh context
            onClose(); // Close modal
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CompleteProfileModal;
