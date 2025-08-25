import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserLogout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URI}/user/logout`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token"); // fallback
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      title="Logout"
      className="absolute right-4 top-4 h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full z-10"
    >
      <i className="ri-logout-box-line text-lg font-medium text-black"></i>
    </button>
  );
}

export default UserLogout;
