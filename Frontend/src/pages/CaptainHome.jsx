import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { CaptainDataContext } from "../context/CaptainContext";
import { useSocket } from "../context/SocketContext";
import { useContext } from "react";
import { useEffect } from "react";
import { lchaToRgba } from "ol/color";
import axios from "axios";

function CaptainHome() {
  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);

  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const { socket } = useSocket();
  const { captain, setCaptain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (socket && captain?._id) {
      socket.emit("join", {
        userId: captain._id,
        userType: "captain",
      });
    }
  }, [socket, captain]);

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log(
        //   `socket.emit("update-location-captain", { userId: ${captain._id}, locatoion: { lat: ${position.coords.latitude}, lon: ${position.coords.longitude} } });`
        // );

        socket.emit("update-location-captain", {
          userId: captain._id,
          location: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
        });
      });
    }
  };

  socket.on("new-ride", (data) => {
    if (data?.captain) {
      console.log("🚕 New ride received:", data);
      setRide(data);
      setRidePopUpPanel(true);
    } else {
      console.error("Received ride data without captain:", data);
    }
  });

  updateLocation();
  const locationInterval = setInterval(updateLocation, 10000); // Update location every 10 seconds
  // return () => clearInterval(locationInterval);

  async function confirmRide() {
    const payload = {
      rideId: ride._id, // Make sure this is valid
      captainId: captain._id, // Make sure this is valid
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Ride confirmed:", response.data);
    } catch (error) {
      console.error("Error confirming ride:", error.message);
      alert(
        `Failed to confirm ride: ${
          error.response?.data?.message || "Unknown error occurred"
        }`
      );
    }

    console.log("captan home confirmRide function run successfully");
    setConfirmRidePopUpPanel(true);
    setRidePopUpPanel(false);
  }

  useGSAP(() => {
    if (ridePopUpPanel) {
      gsap.to(ridePopUpPanelRef.current, {
        transform: "translateY(0%)",
      });
    } else {
      gsap.to(ridePopUpPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [ridePopUpPanel]);

  useGSAP(() => {
    if (confirmRidePopUpPanel) {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: "translateY(0%)",
      });
    } else {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmRidePopUpPanel]);

  return (
    <div className="h-screen flex flex-col">
      {/* Logout Button */}
      <Link
        to="/home"
        className="fixed right-4 top-4 h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full z-10"
        title="Logout"
      >
        <i className="ri-logout-box-line text-lg font-medium text-black"></i>
      </Link>

      {/* Top Image */}
      <div className="h-3/5 ">
        <img
          className="w-full h-full object-cover"
          src="https://imgs.search.brave.com/A9FGg0apJw5tFxYaTVZR3XNGO-SbZK-IiQwKcfRzWi8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA3LzI4LzMwLzI2/LzM2MF9GXzcyODMw/MjYyMF9YZGRuZjVD/bDBLMUFDWnVyZDZ5/QnlVekhpSE1NSW9l/Ni5qcGc"
          alt="Captain Background"
        />
      </div>

      {/* Bottom Info */}
      <div className="h-2/5 p-5 bg-white">
        <CaptainDetails />
      </div>

      <div
        ref={ridePopUpPanelRef}
        className="fixed z-10 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white w-full"
      >
        <RidePopUp
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          setRidePopUpPanel={setRidePopUpPanel}
          ride={ride}
          confirmRide={confirmRide}
        />
      </div>

      <div
        ref={confirmRidePopUpPanelRef}
        className="fixed z-10 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white w-full h-screen"
      >
        <ConfirmRidePopUp
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          setRidePopUpPanel={setRidePopUpPanel}
        />
      </div>
    </div>
  );
}

export default CaptainHome;
