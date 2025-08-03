import { useRef, useState } from "react";
import uberLogo from "../assets/uber-logo.png";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import axios from "axios";
import { SocketProvider } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useEffect } from "react";
import { useContext } from "react";
import { useSocket } from "../context/SocketContext";
import RidePopUp from "../components/RidePopUp";
import { useNavigate } from "react-router-dom";

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

  // Initialize socket connection
  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("join", { userId: user._id, userType: "user" });
    }
  }, [user, socket]);

  socket.on("ride-confirmed", (ride) => {
    console.log("✅ Ride confirmed successfully:", ride);
    if (ride?.captain && ride.status === "accepted") {
      console.log("🎉 You are now assigned to this ride!");
      setRide(ride);
    }
    setVehicleFound(false);
    setWaitingForDriver(true);
  });

  socket.on("ride-started", (ride) => {
    console.log("🚗 Ride started successfully:", ride);
    setWaitingForDriver(false);
    navigate("/riding");
  });

  async function findTrip() {
    console.log("Finding trip for:", pickup, destination);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Fare response:", response.data);
      setFare(response.data || { car: "N/A", motorcycle: "N/A", cng: "N/A" });
    } catch (error) {
      console.error("Error fetching fare:", error.message);
      setFare({ car: "N/A", motorcycle: "N/A", cng: "N/A" });
    }
  }

  const fetchSuggestions = async (e) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const input = e.target.value.trim();
      if (!input) return setSuggestions([]);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuggestions(response.data || []);
    } catch (error) {
      console.error("Error fetching suggestions", error);
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
    if (activeField === "pickup") {
      setPickup(suggestion.display_name);
    } else {
      setDestination(suggestion.display_name);
    }
    setSuggestions([]);
  };

  async function createRide() {
    try {
      const payload = {
        pickup,
        destination,
        vehicleType,
      };
      console.log("Creating ride with payload:", payload);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Ride created successfully:", response.data);
    } catch (error) {
      console.error("Error creating ride:", error.message);
      console.error(
        "Response details:",
        error.response?.data || "No response data"
      );
      alert(
        `Failed to create ride: ${
          error.response?.data?.message || "Unknown error occurred"
        }`
      );
    }
  }

  // GSAP Animations
  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? "70%" : "0%",
      padding: panelOpen ? 24 : 0,
    });
    gsap.to(panelCloseRef.current, {
      opacity: panelOpen ? 1 : 0,
    });
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
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src={uberLogo}
        alt="uber logo"
      />

      <div className="w-screen h-screen">
        <img
          className="w-full h-full object-cover"
          src="https://imgs.search.brave.com/A9FGg0apJw5tFxYaTVZR3XNGO-SbZK-IiQwKcfRzWi8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA3LzI4LzMwLzI2/LzM2MF9GXzcyODMw/MjYyMF9YZGRuZjVD/bDBLMUFDWnVyZDZ5/QnlVekhpSE1NSW9l/Ni5qcGc"
          alt=""
        />
      </div>

      <div className="top-0 absolute h-screen w-full flex flex-col justify-end">
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

      <div
        ref={vehiclePanelRef}
        className="fixed z-10 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white w-full"
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
        className="fixed z-10 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white w-full"
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
        className="fixed z-10 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white w-full"
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
        className="fixed z-10 bottom-0 px-3 py-6 pt-12 bg-white w-full translate-y-full"
      >
        <WaitingForDriver
          setWaitingForDriver={setWaitingForDriver}
          ride={ride}
        />
      </div>
    </div>
  );
};

export default Home;
