import { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isSubmitting?: boolean;
  isRTL?: boolean;
}

const ConfirmationModal = ({
  isRTL,
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isSubmitting = false,
}: ConfirmationModalProps) => {
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
    <AlertDialog
      open={isOpen}
      onOpenChange={(open: boolean) => !open && onClose()}
    >
      <AlertDialogContent className="min-h-52" dir={isRTL ? "rtl" : "ltr"}>
        <AlertDialogHeader>
          <AlertDialogTitle className={`${isRTL ? "text-right" : ""}`}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription
            className={`${isRTL ? "text-right" : ""} text-md text-primary`}
          >
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={`${isRTL ? "text-right" : ""} gap-3`}>
          <AlertDialogAction
            onClick={(e: any) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isSubmitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-md bg-primary text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {confirmText}
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
          <AlertDialogCancel disabled={isSubmitting} className="text-md">
            {cancelText}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
