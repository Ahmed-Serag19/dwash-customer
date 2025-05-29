import React, { useState, useEffect, useRef } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useChat } from "@/hooks/useChat";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  freelancerName: string;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  requestId,
  freelancerName,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { messages, status, error, subscribed, sendMessage, retry } =
    useChat(requestId);

  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <div className="bg-white rounded-lg w-full max-w-md h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-blue-600 text-white flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {t("chatWith", { defaultValue: "Chat with" })} {freelancerName}
          </h3>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Connecting */}
        {status === "connecting" && (
          <div className="p-2 bg-yellow-100 text-yellow-800 text-center text-sm">
            <Loader2 className="inline-block animate-spin mr-2" size={16} />
            {t("connecting", { defaultValue: "Connecting..." })}
          </div>
        )}

        {/* Error + Retry */}
        {error && (
          <div className="p-2 bg-red-100 text-red-800 text-center text-sm">
            {error}{" "}
            <button onClick={retry} className="underline">
              {t("retry", { defaultValue: "Retry" })}
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">
              {t("noMessages", { defaultValue: "No messages yet." })}
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 ${
                  msg.messageSender === "CONSUMER" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    msg.messageSender === "CONSUMER"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-gray-200 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.message}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdOn || "").toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t flex items-center" dir="ltr">
          <textarea
            rows={2}
            className="flex-1 border rounded-l-lg p-2 focus:outline-none"
            placeholder={
              status !== "connected" || !subscribed
                ? t("waiting", { defaultValue: "Waiting..." })
                : t("typeMessage", { defaultValue: "Type a message..." })
            }
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={status !== "connected" || !subscribed}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(draft);
                setDraft("");
              }
            }}
          />
          <button
            onClick={() => {
              sendMessage(draft);
              setDraft("");
            }}
            disabled={!draft.trim() || status !== "connected" || !subscribed}
            className={`px-4 rounded-r-lg h-full ${
              !draft.trim() || status !== "connected" || !subscribed
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
