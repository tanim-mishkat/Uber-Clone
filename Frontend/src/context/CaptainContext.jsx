import { createContext, useEffect, useState } from "react";
import { http } from "./http";
import { api } from "./apiBase";

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      http
        .get(api("/captains/profile"))
        .then((res) => {
          console.log("🚨 captain profile response", res.data);
          setCaptain(res.data);
        })
        .catch((err) => {
          console.error("Not logged in");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <CaptainDataContext.Provider value={{ captain, setCaptain, isLoading }}>
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;
