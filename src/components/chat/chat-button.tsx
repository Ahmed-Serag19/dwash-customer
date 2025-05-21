import type React from "react";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatButtonProps {
  requestId: number;
  onOpenChat: (requestId: number) => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ requestId, onOpenChat }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={() => onOpenChat(requestId)}
      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
    >
      <MessageCircle size={18} />
      {t("chatWithFreelancer")}
    </button>
  );
};

export default ChatButton;
