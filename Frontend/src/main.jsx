import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import CaptainContext from "./context/CaptainContext.jsx";
import { SocketProvider } from "./context/SocketContext";

import { ToasterProvider } from "./components/ui/Toaster.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <UserContext>
        <CaptainContext>
          <BrowserRouter>
            <ToasterProvider>
              <App />
            </ToasterProvider>
          </BrowserRouter>
        </CaptainContext>
      </UserContext>
    </SocketProvider>
  </StrictMode>
);
