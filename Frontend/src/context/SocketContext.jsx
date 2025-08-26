import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { apiBase } from "./apiBase";
import { useContext } from "react";
import { UserDataContext } from "./UserContext";
import { CaptainDataContext } from "./CaptainContext";

export const SocketContext = createContext({
  socket: null,
  join: () => {},
  emit: () => {},
});

export const SocketProvider = ({ children }) => {
  const baseURL = useMemo(apiBase, []);
  const [socket, setSocket] = useState(null);
  const connectingRef = useRef(false);

  const { user: appUser } = useContext(UserDataContext) || {};
  const { captain } = useContext(CaptainDataContext) || {};
  // Decide who is logged in:
  // - If captain exists, prefer captain; else if user exists, use user
  const current = useMemo(() => {
    if (captain?._id) return { id: captain._id, type: "captain" };
    if (appUser?._id) return { id: appUser._id, type: "user" };
    return null;
  }, [appUser?._id, captain?._id]);

  useEffect(() => {
    if (connectingRef.current || socket) return;
    connectingRef.current = true;

    const s = io(baseURL, {
      withCredentials: true,
      transports: ["websocket"], // prefer ws; proxy-friendly
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
    if (!socket || !current?.id || !current?.type) return;
    console.log("[socket] join emit", current);
    socket.emit("join", { userId: current.id, userType: current.type });
  }, [socket, current?.id, current?.type]);

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
