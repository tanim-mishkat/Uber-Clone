import { useContext } from "react";
import { ToastCtx } from "./toastContext";

export function useToaster() {
    const ctx = useContext(ToastCtx);
    if (!ctx) throw new Error("useToaster must be used within <ToasterProvider>");
    return ctx;
}
export default useToaster;