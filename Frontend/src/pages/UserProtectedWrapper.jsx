import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { http } from "../context/http";
import { api } from "../context/apiBase";

function UserProtectedWrapper({ children }) {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !userType) {
      navigate("/login");
      return;
    }

    const endpoint =
      userType === "captain" ? "/captains/profile" : "/users/profile";

    http
      .get(api(endpoint))
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate("/login");
      });
  }, [token, userType, navigate, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

export default UserProtectedWrapper;
