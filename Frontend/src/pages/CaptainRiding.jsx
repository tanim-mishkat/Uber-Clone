import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import LiveTracking from "../components/LiveTracking";
import MobileFrame from "../components/layout/MobileFrame";

const CaptainRiding = () => {
  const location = useLocation();
  const rideData = location.state?.ride;

  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  useGSAP(() => {
    gsap.to(finishRidePanelRef.current, {
      transform: finishRidePanel ? "translateY(0%)" : "translateY(100%)",
    });
  }, [finishRidePanel]);

  return (
    <MobileFrame>
      <div className="h-full relative flex flex-col">
        {/* Logout Button (scoped to frame) */}
        <Link
          to="/home"
          className="absolute right-4 top-4 h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full z-10"
          title="Logout"
        >
          <i className="ri-logout-box-line text-lg font-medium text-black"></i>
        </Link>

        {/* Map */}
        <div className="h-4/5 relative z-0">
          <LiveTracking />
        </div>

        {/* Bottom action bar */}
        <div
          onClick={() => setFinishRidePanel(true)}
          className="relative h-1/5 p-5 bg-yellow-400 flex items-center justify-between"
        >
          <h5 className="p-1 text-center absolute top-0 w-[95%]">
            <i className="ri-arrow-up-wide-line text-3xl text-black"></i>
          </h5>

          <h4 className="text-xl font-semibold">4 km away</h4>
          <button className="bg-green-600 text-white font-semibold p-2 px-6 rounded-lg">
            Confirm Ride
          </button>
        </div>

        {/* Finish ride sheet (inside frame) */}
        <div
          ref={finishRidePanelRef}
          className="absolute left-0 right-0 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white h-full"
        >
          <FinishRide
            setFinishRidePanel={setFinishRidePanel}
            rideData={rideData}
          />
        </div>
      </div>
    </MobileFrame>
  );
};

export default CaptainRiding;
