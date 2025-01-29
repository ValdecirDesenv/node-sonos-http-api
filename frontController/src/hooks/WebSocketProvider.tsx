import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface WebSocketContextProps {
  messages: any[];
  sendMessage: (msg: any) => void;
  toggleStates: { [key: string]: boolean };
  setToggleState: (groupId: string, state: boolean) => void;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:3000");
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connection established.");
      };

      ws.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        try {
          setMessages((prev) => [...prev, JSON.parse(event.data)]);
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      ws.onclose = () => {
        console.warn("WebSocket connection closed. Retrying...");
        retryTimeout = setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      socketRef.current?.close();
      clearTimeout(retryTimeout);
    };
  }, []);

  const sendMessage = (msg: any) => {
    const socket = socketRef.current;

    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("Sending message:", msg);
      socket.send(JSON.stringify(msg));
    } else {
      console.error("WebSocket is not open. Message not sent:", msg);
    }
  };

  const setToggleState = (groupId: string, state: boolean) => {
    setToggleStates((prev) => ({ ...prev, [groupId]: state }));

    fetch("/api/toggle-states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, state }),
    }).catch((err) => console.error("Error updating toggle state:", err));
  };

  return (
    <WebSocketContext.Provider
      value={{ messages, sendMessage, toggleStates, setToggleState }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
