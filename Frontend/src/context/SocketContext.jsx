import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { getBaseUrl } from "./socketBaseUrl"; // moved helper

export const SocketContext = createContext({
  socket: null,
  join: () => {},
  emit: () => {},
});

export const SocketProvider = ({ children, user }) => {
  const baseURL = useMemo(getBaseUrl, []);
  const [socket, setSocket] = useState(null);
  const connectingRef = useRef(false);

  useEffect(() => {
    if (connectingRef.current || socket) return;
    connectingRef.current = true;

    const s = io(baseURL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 8,
      reconnectionDelay: 500,
      reconnectionDelayMax: 4000,
      timeout: 65000,
    });

    setSocket(s);

    s.on("connect", () => console.log("[socket] connected:", s.id));
    s.on("disconnect", (reason) =>
      console.log("[socket] disconnected:", reason)
    );
    s.on("connect_error", (err) =>
      console.log("[socket] connect_error:", err?.message)
    );

    return () => {
      try {
        s.removeAllListeners();
        s.disconnect();
      } finally {
        connectingRef.current = false;
        setSocket(null);
      }
    };
  }, [baseURL, socket]);

  useEffect(() => {
    if (!socket || !user?.id || !user?.type) return;
    socket.emit("join", { userId: user.id, userType: user.type });
  }, [socket, user?.id, user?.type]);

  const ctx = useMemo(
    () => ({
      socket,
      join: (userId, userType) => socket?.emit("join", { userId, userType }),
      emit: (event, data) => socket?.emit(event, data),
    }),
    [socket]
  );

  return (
    <SocketContext.Provider value={ctx}>{children}</SocketContext.Provider>
  );
};
