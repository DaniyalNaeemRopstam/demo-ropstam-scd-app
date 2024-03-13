import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useWebsocket = (url: string) => {
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    const newSocket = io(url);
    newSocket.on("connect", () => setConnected(true));
    newSocket.on("disconnect", () => setConnected(false));
    setSocket(newSocket);

    return () => {
      socket?.off("connect", () => setConnected(false));
      socket?.off("disconnect", () => setConnected(false));
    };
  }, []);

  return {
    connected,
    socket,
  };
};
