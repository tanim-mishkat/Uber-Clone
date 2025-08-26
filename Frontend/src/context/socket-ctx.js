import { createContext } from "react";

export const SocketContext = createContext({
    socket: null,
    isConnected: false,
    join: () => { },
    emit: () => { },
});