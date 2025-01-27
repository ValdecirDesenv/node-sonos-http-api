// import { useEffect, useState } from "react";

// interface WebSocketMessage {
//   type: string;
//   data: any;
// }

// export const useWebSocket = (url: string) => {
//   const [data, setData] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const ws = new WebSocket(url);

//     ws.onopen = () => console.log("WebSocket connection opened");
//     // ws.onmessage = (event) => {
//     //   try {
//     //     const message: WebSocketMessage = JSON.parse(event.data);
//     //     if (message.type === "initial" || message.type === "topology-change") {
//     //       setData(message.data);
//     //     }
//     //   } catch (e) {
//     //     console.error("Failed to parse WebSocket message:", event.data);
//     //   }
//     // };
//     ws.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       if (message.type === "initial" || message.type === "topology-change") {
//         const zonesArray = Object.values(message.data); // Convert object to array
//         setData(zonesArray);
//       }
//     };

//     ws.onerror = () => setError("WebSocket Error");
//     ws.onclose = () => console.log("WebSocket connection closed");

//     return () => ws.close();
//   }, [url]);

//   return { data, error };
// };
