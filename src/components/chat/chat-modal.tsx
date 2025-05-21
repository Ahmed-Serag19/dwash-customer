import type React from "react";
import { useEffect, useState, useRef } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Client } from "@stomp/stompjs";
import { useUser } from "@/context/UserContext";

// Polyfill for global (needed by @stomp/stompjs in some browser contexts)
if (typeof window !== "undefined" && !window.global) {
  window.global = window;
}

interface Message {
  messageId?: number;
  messageSender: "CONSUMER" | "FREELANCER";
  message: string;
  chatId?: number;
  createdOn?: string;
}

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
  const { token } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://api.stg.2025.dwash.cood2.dussur.sa/api";
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (!isOpen || !token) return;

    // Fetch initial chat history
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/chat/?requestID=${requestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }
        );

        const data = await response.json();
        if (data.success && data.content) {
          setMessages(data.content.messages || []);
        } else {
          setError(data.messageEn || "Failed to load chat history");
        }
      } catch (err) {
        setError("Failed to load chat history");
        console.error("Error fetching chat history:", err);
      }
    };

    fetchChatHistory();

    // Connect to WebSocket
    const connectWebSocket = () => {
      setIsConnecting(true);

      try {
        const client = new Client({
          webSocketFactory: () => {
            return new WebSocket(
              `wss://api.stg.2025.dwash.cood2.dussur.sa/api/ws-chat?requestId=${requestId}&access_token=${token}`
            );
          },
          connectHeaders: {}, // No Authorization here (not supported in browser)
          debug: (str) => {
            console.log("STOMP:", str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            console.log("✅ Connected to WebSocket");
            setIsConnected(true);
            setIsConnecting(false);
            setError(null);

            client.subscribe(`/topic/chat/${requestId}`, (message) => {
              try {
                const receivedMsg = JSON.parse(message.body);
                setMessages((prev) => [...prev, receivedMsg]);
              } catch (e) {
                console.error("Error parsing message:", e);
              }
            });
          },
          onStompError: (frame) => {
            console.error("STOMP error:", frame.headers.message);
            setError("Connection error: " + frame.headers.message);
            setIsConnecting(false);
            setIsConnected(false);
          },
          onWebSocketError: (error) => {
            console.error("WebSocket error:", error);
            setError("WebSocket connection error");
            setIsConnecting(false);
            setIsConnected(false);
          },
        });

        clientRef.current = client;
        client.activate();
      } catch (err) {
        console.error("WebSocket connect error:", err);
        setError("Failed to connect to chat server");
        setIsConnecting(false);
      }
    };

    connectWebSocket();

    return () => {
      if (clientRef.current && clientRef.current.connected) {
        clientRef.current.deactivate();
      }
    };
  }, [isOpen, requestId, token, apiBaseUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected || !clientRef.current) return;

    const messageToSend = { content: newMessage.trim() };

    try {
      clientRef.current.publish({
        destination: "/app/chat",
        body: JSON.stringify(messageToSend),
        headers: {
          "content-type": "application/json",
        },
      });

      setNewMessage("");
    } catch (err) {
      console.error("Send error:", err);
      setError("Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="bg-white rounded-lg w-full max-w-md h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white rounded-t-lg">
          <h3 className="text-lg font-bold">
            {t("chatWith")} {freelancerName}
          </h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        {isConnecting && (
          <div className="p-2 bg-yellow-100 text-yellow-800 flex items-center justify-center">
            <Loader2 className="animate-spin mr-2" size={16} />
            {t("connecting")}...
          </div>
        )}

        {error && <div className="p-2 bg-red-100 text-red-800">{error}</div>}

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {t("noMessages")}
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.messageId || index}
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
                {msg.createdOn && (
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(msg.createdOn).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t">
          <div className="flex" dir="ltr">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("typeMessage")}
              className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected}
              rows={2}
              style={{ textAlign: isRTL ? "right" : "left" }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!isConnected || !newMessage.trim()}
              className={`px-4 rounded-r-lg flex items-center justify-center ${
                isConnected && newMessage.trim()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
