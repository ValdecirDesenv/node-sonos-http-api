import React, { createContext, useContext, useEffect, useState } from "react";

interface WebSocketContextProps {
  messages: any[];
  sendMessage: (msg: any) => void;
}
const WebSocketContext = createContext<WebSocketContextProps | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    let retryTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      ws = new WebSocket("ws://localhost:3000");

      ws.onopen = () => {
        console.log("WebSocket connection established.");
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        setMessages((prev) => [...prev, JSON.parse(event.data)]);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      ws.onclose = () => {
        console.warn("WebSocket connection closed. Retrying...");
        retryTimeout = setTimeout(connectWebSocket, 3000); // Retry in 3 seconds
      };
    };

    connectWebSocket();

    return () => {
      ws?.close();
      clearTimeout(retryTimeout);
    };
  }, []);

  const sendMessage = (msg: any) => {
    if (socket) {
      socket.send(JSON.stringify(msg));
    }
  };

  return (
    <WebSocketContext.Provider value={{ messages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  console.log(context);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
