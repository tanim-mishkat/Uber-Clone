import { useRef, useState, useEffect, useContext } from "react";
import uberLogo from "../assets/uber-logo.png";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { http } from "../context/http";
import { api } from "../context/apiBase";
import { UserDataContext } from "../context/UserContext";
import { useSocket } from "../context/useSocket.js";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import MobileFrame from "../components/layout/MobileFrame.jsx";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState("");
  const [fare, setFare] = useState(null);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const navigate = useNavigate();

  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const submitHandler = (e) => e.preventDefault();
  const [vehicleType, setVehicleType] = useState("");
  const [ride, setRide] = useState(null);

  const { socket } = useSocket();
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("join", { userId: user._id, userType: "user" });
    }
  }, [user, socket]);

  useEffect(() => {
    if (!socket) return;
    const onConfirmed = (r) => {
      if (r?.captain && r.status === "accepted") setRide(r);
      setVehicleFound(false);
      setWaitingForDriver(true);
    };
    const onStarted = (r) => {
      setWaitingForDriver(false);
      navigate("/riding", { state: { ride: r } });
    };
    socket.on("ride-confirmed", onConfirmed);
    socket.on("ride-started", onStarted);
    return () => {
      socket.off("ride-confirmed", onConfirmed);
      socket.off("ride-started", onStarted);
    };
  }, [socket, navigate]);

  async function findTrip() {
    try {
      const response = await http.get(api("/rides/get-fare"), {
        params: { pickup, destination },
      });

      setFare(response.data || { car: "N/A", motorcycle: "N/A", cng: "N/A" });
    } catch {
      setFare({ car: "N/A", motorcycle: "N/A", cng: "N/A" });
    }
  }

  const fetchSuggestions = async (e) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const input = e.target.value.trim();
      if (!input) return setSuggestions([]);
      const response = await http.get(api("/maps/get-suggestions"), {
        params: { input },
      });

      setSuggestions(response.data || []);
    } catch {
      setSuggestions([]);
    }
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    field === "pickup" ? setPickup(value) : setDestination(value);
    setActiveField(field);
    if (value.trim().length > 2) fetchSuggestions(e);
    else setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    if (activeField === "pickup") setPickup(suggestion.display_name);
    else setDestination(suggestion.display_name);
    setSuggestions([]);
  };

  async function createRide() {
    try {
      const payload = { pickup, destination, vehicleType };
      await http.post(api("/rides/create"), payload);
      
      setVehicleFound(true);
      setConfirmRidePanel(false);
    } catch (error) {
      console.error("Error creating ride:", error.message);
      console.error(
        "Response details:",
        error.response?.data || "No response data"
      );
    }
  }

  // Slide suggestions panel under inputs (same behavior you had)
  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? "70%" : "0%",
      padding: panelOpen ? 24 : 0,
    });
    gsap.to(panelCloseRef.current, { opacity: panelOpen ? 1 : 0 });
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      transform: vehiclePanel ? "translateY(0%)" : "translateY(100%)",
    });
  }, [vehiclePanel]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      transform: confirmRidePanel ? "translateY(0%)" : "translateY(100%)",
    });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      transform: vehicleFound ? "translateY(0%)" : "translateY(100%)",
    });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      transform: waitingForDriver ? "translateY(0%)" : "translateY(100%)",
    });
  }, [waitingForDriver]);

  return (
    <MobileFrame>
      <div className="h-full relative overflow-hidden">
        <img
          className="w-16 absolute left-5 top-5 z-10"
          src={uberLogo}
          alt="uber logo"
        />

        <div className="w-full h-full relative z-0">
          <LiveTracking />
        </div>

        {/* Inputs section + sliding results (original layout) */}
        <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-end">
          <div className="h-[30%] p-6 bg-white relative">
            <h5
              ref={panelCloseRef}
              onClick={() => setPanelOpen(false)}
              className="absolute opacity-0 top-6 right-6 text-2xl"
            >
              <i className="ri-arrow-down-wide-line"></i>
            </h5>
            <h4 className="text-2xl font-semibold">Find a trip</h4>
            <form onSubmit={submitHandler}>
              <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-900 rounded-full"></div>
              <input
                value={pickup}
                onChange={(e) => handleInputChange(e, "pickup")}
                onClick={() => setPanelOpen(true)}
                className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-5"
                type="text"
                placeholder="Add a pickup location"
              />
              <input
                value={destination}
                onChange={(e) => handleInputChange(e, "destination")}
                onClick={() => setPanelOpen(true)}
                className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3"
                type="text"
                placeholder="Enter your destination"
              />
            </form>
          </div>

          <div ref={panelRef} className="h-0 bg-white overflow-hidden">
            <LocationSearchPanel
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              pickup={pickup}
              destination={destination}
              setVehiclePanel={setVehiclePanel}
              setPanelOpen={setPanelOpen}
              findTrip={findTrip}
            />
          </div>
        </div>

        {/* Bottom sheets — anchored INSIDE the device (absolute, not fixed) */}
        <div
          ref={vehiclePanelRef}
          className="absolute left-0 right-0 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white"
        >
          <VehiclePanel
            setVehiclePanel={setVehiclePanel}
            setConfirmRidePanel={setConfirmRidePanel}
            setPanelOpen={setPanelOpen}
            pickup={pickup}
            destination={destination}
            fare={fare}
            setFare={setFare}
            selectVehicleType={setVehicleType}
          />
        </div>

        <div
          ref={confirmRidePanelRef}
          className="absolute left-0 right-0 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white"
        >
          <ConfirmRide
            setConfirmRidePanel={setConfirmRidePanel}
            setVehicleFound={setVehicleFound}
            createRide={createRide}
            pickup={pickup}
            destination={destination}
            vehicleType={vehicleType}
            fare={fare}
          />
        </div>

        <div
          ref={vehicleFoundRef}
          className="absolute left-0 right-0 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white"
        >
          <LookingForDriver
            setVehicleFound={setVehicleFound}
            pickup={pickup}
            destination={destination}
            vehicleType={vehicleType}
            fare={fare}
          />
        </div>

        <div
          ref={waitingForDriverRef}
          className="absolute left-0 right-0 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white"
        >
          <WaitingForDriver
            setWaitingForDriver={setWaitingForDriver}
            ride={ride}
          />
        </div>
      </div>
    </MobileFrame>
  );
};

export default Home;
