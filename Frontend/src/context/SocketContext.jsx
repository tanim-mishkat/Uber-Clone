import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";
import { apiBase } from "./apiBase";
import { UserDataContext } from "./UserContext";
import { CaptainDataContext } from "./CaptainContext";
import { SocketContext } from "./socket-ctx.js";

export const SocketProvider = ({ children }) => {
  const baseURL = useMemo(apiBase, []);
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  const { user: appUser } = useContext(UserDataContext) || {};
  const { captain } = useContext(CaptainDataContext) || {};
  const current = useMemo(() => {
    if (captain?._id) return { id: captain._id, type: "captain" };
    if (appUser?._id) return { id: appUser._id, type: "user" };
    return null;
  }, [appUser?._id, captain?._id]);

  useEffect(() => {
    if (socketRef.current) return;

    const s = io(baseURL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 8,
      reconnectionDelay: 500,
      reconnectionDelayMax: 4000,
      timeout: 65000,
    });

    socketRef.current = s;

    const onConnect = () => {
      setConnected(true);
    };
    const onDisconnect = () => setConnected(false);

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("connect_error", (err) =>
      console.log("[socket] connect_error:", err?.message)
    );

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.removeAllListeners();
      s.close();
      socketRef.current = null;
      setConnected(false);
    };
  }, [baseURL]);

  useEffect(() => {
    const s = socketRef.current;
    if (!s || !current?.id || !current?.type) return;
    const sendJoin = () =>
      s.emit("join", { userId: current.id, userType: current.type });
    if (s.connected) sendJoin();
    else s.once("connect", sendJoin);
    return () => s.off("connect", sendJoin);
  }, [current?.id, current?.type]);

  const ctx = useMemo(
    () => ({
      socket: socketRef.current,
      isConnected: connected,
      join: (userId, userType) =>
        socketRef.current?.emit("join", { userId, userType }),
      emit: (event, data) => socketRef.current?.emit(event, data),
    }),
    [connected]
  );

  return (
    <SocketContext.Provider value={ctx}>{children}</SocketContext.Provider>
  );
};
