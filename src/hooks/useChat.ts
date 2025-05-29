import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Client, Frame, IMessage } from "@stomp/stompjs";
import { useUser } from "@/context/UserContext";
import { baseUrl } from "@/constants/endPoints";

export interface ChatMessage {
  messageId?: number;
  messageSender: "CONSUMER" | "FREELANCER";
  message: string;
  chatId?: number;
  createdOn?: string;
}

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export function useChat(requestId: number) {
  const { token } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const clientRef = useRef<Client>();
  const subscriptionRef = useRef<any>();

  // Build the WebSocket URL once per requestId/token
  const wsUrl = useMemo(() => {
    if (!token || !requestId) return "";
    const protocolUrl = baseUrl.replace(/^http/, "ws");
    const authParam = encodeURIComponent(`Bearer ${token}`);
    return `${protocolUrl}/ws-chat?requestId=${requestId}&Authorization=${authParam}`;
  }, [requestId, token]);

  // Load the REST chat history
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/chat/?requestID=${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.messageEn || res.statusText);
      }
      const data = await res.json();
      setMessages(data.content?.messages || []);
    } catch (e: any) {
      console.error("Fetch history error:", e);
      setError("Failed to load chat history");
    }
  }, [requestId, token]);

  // (Re)connect STOMP over WebSocket
  const connect = useCallback(() => {
    if (!wsUrl) return;

    // Tear down previous client if any
    clientRef.current?.deactivate();
    setStatus("connecting");
    setError(null);
    setSubscribed(false);

    const client = new Client({
      brokerURL: wsUrl,
      debug: (msg) => console.log("STOMP ▶", msg),
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,

      // on successful STOMP CONNECT
      onConnect: (_frame: Frame) => {
        subscriptionRef.current = client.subscribe(
          `/topic/chat/${requestId}`,
          (msg: IMessage) => {
            try {
              const { messageSender, content } = JSON.parse(msg.body);
              setMessages((prev) => [
                ...prev,
                {
                  messageSender,
                  message: content,
                  createdOn: new Date().toISOString(),
                },
              ]);
            } catch (e) {
              console.error("Message parse error:", e);
            }
          }
        );
        setSubscribed(true);
        setStatus("connected");
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers.message);
        setError(frame.headers.message || "STOMP protocol error");
        setStatus("error");
      },

      onWebSocketError: (evt) => {
        console.error("WebSocket error:", evt);
        setError("WebSocket connection failed");
        setStatus("error");
      },

      onWebSocketClose: () => {
        console.log("WebSocket closed");
        setStatus("disconnected");
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [wsUrl, requestId]);

  // Send a new chat message
  const sendMessage = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || status !== "connected" || !subscribed) {
        setError("Not ready to send");
        return;
      }
      // optimistic UI update
      setMessages((prev) => [
        ...prev,
        {
          messageSender: "CONSUMER",
          message: content,
          createdOn: new Date().toISOString(),
        },
      ]);
      try {
        clientRef.current?.publish({
          destination: "/app/chat",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content, requestId }),
        });
      } catch (e) {
        console.error("Send failed:", e);
        setError("Failed to send message");
        // rollback
        setMessages((prev) => prev.slice(0, -1));
      }
    },
    [requestId, status, subscribed]
  );

  // Initialize on mount and whenever wsUrl changes
  useEffect(() => {
    fetchHistory();
    const cleanup = connect();
    return () => {
      cleanup?.();
    };
  }, [fetchHistory, connect]);

  return {
    messages,
    status,
    error,
    subscribed,
    sendMessage,
    retry: connect,
  };
}
