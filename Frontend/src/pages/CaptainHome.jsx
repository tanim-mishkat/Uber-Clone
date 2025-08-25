import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useRef, useState, useContext, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { CaptainDataContext } from "../context/CaptainContext";
import { useSocket } from "../context/useSocket";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";
import MobileFrame from "../components/layout/MobileFrame";

function CaptainHome() {
  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);

  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const { socket } = useSocket();
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (socket && captain?._id) {
      socket.emit("join", { userId: captain._id, userType: "captain" });
    }
  }, [socket, captain]);

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
    updateLocation();
    const locationInterval = setInterval(updateLocation, 10000);
    return () => clearInterval(locationInterval);
  }, [captain?._id, socket]);

  useEffect(() => {
    if (!socket) return;
    const onNewRide = (r) => {
      if (r && r.status === "pending" && !r.captain) {
        setRide(r);
        setRidePopUpPanel(true);
      }
    };
    socket.on("new-ride", onNewRide);
    return () => socket.off("new-ride", onNewRide);
  }, [socket]);

  async function confirmRide() {
    if (!ride?._id || !captain?._id) return;
    try {
      const payload = { rideId: ride._id, captainId: captain._id };
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.log(
        "Error confirming ride:",
        error.response?.data || error.message
      );
      return;
    }
    setConfirmRidePopUpPanel(true);
    setRidePopUpPanel(false);
  }

  useGSAP(() => {
    gsap.to(ridePopUpPanelRef.current, {
      transform: ridePopUpPanel ? "translateY(0%)" : "translateY(100%)",
    });
  }, [ridePopUpPanel]);

  useGSAP(() => {
    gsap.to(confirmRidePopUpPanelRef.current, {
      transform: confirmRidePopUpPanel ? "translateY(0%)" : "translateY(100%)",
    });
  }, [confirmRidePopUpPanel]);

  return (
    <MobileFrame>
      <div className="h-full relative flex flex-col">
        <Link
          to="/home"
          className="absolute right-4 top-4 h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full z-10"
          title="Logout"
        >
          <i className="ri-logout-box-line text-lg font-medium text-black"></i>
        </Link>

        <div className="h-3/5 relative z-0">
          <LiveTracking />
        </div>

        <div className="h-2/5 p-5 bg-white">
          <CaptainDetails />
        </div>

        <div
          ref={ridePopUpPanelRef}
          className="absolute z-10 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white w-full"
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
          className="absolute z-10 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white w-full h-full"
        >
          <ConfirmRidePopUp
            setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
            setRidePopUpPanel={setRidePopUpPanel}
            ride={ride}
          />
        </div>
      </div>
    </MobileFrame>
  );
}

export default CaptainHome;
