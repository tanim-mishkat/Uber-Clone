import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import FinishRide from "../components/FinishRide";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);

  const finishRidePanelRef = useRef(null);

  useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(0%)",
      });
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [finishRidePanel]);
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
      <div className="h-4/5 ">
        <img
          className="w-full h-full object-cover"
          src="https://imgs.search.brave.com/A9FGg0apJw5tFxYaTVZR3XNGO-SbZK-IiQwKcfRzWi8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA3LzI4LzMwLzI2/LzM2MF9GXzcyODMw/MjYyMF9YZGRuZjVD/bDBLMUFDWnVyZDZ5/QnlVekhpSE1NSW9l/Ni5qcGc"
          alt="Captain Background"
        />
      </div>
      <div
        onClick={() => setFinishRidePanel(true)}
        className=" relative h-1/5 p-5 bg-yellow-400 flex items-center justify-between"
      >
        <h5 className="p-1 text-center absolute top-0 w-[95%] ">
          <i className="ri-arrow-up-wide-line text-3xl text-black"></i>
        </h5>

        <h4 className="text-xl font-semibold">4 km away</h4>
        <button className=" bg-green-600 text-white font-semibold  p-2 px-6 rounded-lg">
          Confirm Ride
        </button>
      </div>

      <div
        ref={finishRidePanelRef}
        className="fixed z-10 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white w-full h-screen"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
