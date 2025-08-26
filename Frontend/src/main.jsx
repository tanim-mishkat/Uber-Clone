import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import CaptainContext from "./context/CaptainContext.jsx";
import { SocketProvider } from "./context/SocketContext";

import { ToasterProvider } from "./components/ui/Toaster.jsx";
createRoot(document.getElementById("root")).render(
  <UserContext>
    <CaptainContext>
      <SocketProvider>
        <BrowserRouter>
          <ToasterProvider>
            <App />
          </ToasterProvider>
        </BrowserRouter>
      </SocketProvider>
    </CaptainContext>
  </UserContext>
);
