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
import axios from "axios";
import LiveTracking from "../components/LiveTracking";

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

  // const updateLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       socket.emit("update-location-captain", {
  //         userId: captain._id,
  //         location: {
  //           lat: position.coords.latitude,
  //           lon: position.coords.longitude,
  //         },
  //       });
  //     });
  //   }
  // };

  // updateLocation();
  // const locationInterval = setInterval(updateLocation, 10000); // Update location every 10 seconds
  // // return () => clearInterval(locationInterval);

  useEffect(() => {
    function updateLocation() {
      if (navigator.geolocation && captain?._id && socket) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
          });
        });
      }
    }

    updateLocation(); // Initial call
    const locationInterval = setInterval(updateLocation, 10000);

    return () => clearInterval(locationInterval); // Cleanup on unmount
  }, [captain?._id, socket]);

  socket.on("new-ride", (ride) => {
    console.log("📢 Raw ride ride received:", ride);

    if (ride && ride.status === "pending" && !ride.captain) {
      console.log("🚕 New ride available for acceptance:", ride);
      setRide(ride);
      setRidePopUpPanel(true);
    } else {
      console.warn("⚠️ Received invalid/already-assigned ride:", {
        hasride: !!ride,
        status: ride?.status,
        hasCaptain: !!ride?.captain,
      });
    }
  });

  async function confirmRide() {
    if (!ride?._id || !captain?._id) {
      console.error("❌ Missing ride or captain data:", {
        rideId: ride?._id,
        captainId: captain?._id,
      });
      alert("Error: Missing ride or captain information");
      return;
    }
    const payload = {
      rideId: ride._id,
      captainId: captain._id,
    };
    console.log("🚗 Attempting to confirm ride with payload:", payload);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Ride confirmed:", response.data);
      // Check if response has captain populated
      if (response.data?.captain) {
        console.log("🎉 Captain successfully assigned:", response.data.captain);
      } else {
        console.warn("⚠️ Response missing captain data:", response.data);
      }
    } catch (error) {
      console.error("❌ Error confirming ride:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error,
      });
      // Show detailed error message
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";

      alert(`Failed to confirm ride: ${errorMessage}`);
      return;
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
      <div className="h-3/5 relative z-0">
        <LiveTracking />
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
          ride={ride}
        />
      </div>
    </div>
  );
}

export default CaptainHome;
