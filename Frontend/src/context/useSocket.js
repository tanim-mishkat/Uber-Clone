import { useContext } from "react";
import { SocketContext } from "./socket-ctx.js";

export const useSocket = () => useContext(SocketContext);
export default useSocket;
