import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../context/http";
import { api } from "../context/apiBase";

const FinishRide = (props) => {
  const navigate = useNavigate();
  async function endRide() {
    try {
      const response = await http.post(api("/rides/end-ride"), {
        rideId: props.rideData?._id,
      });
      
      if (response.status === 200) {
        console.log("Ride ended successfully:", response.data);
        navigate("/captain-home");
      }
    } catch (error) {
      console.error("Error ending ride:", error.message);
      console.error(
        "Response details:",
        error.response?.data || "No response data"
      );
    }
  }
  return (
    <div>
      <h5
        onClick={() => props.setFinishRidePanel(false)}
        className="p-1 text-center absolute top-0 w-[90%] "
      >
        <i className="ri-arrow-down-wide-line text-3xl text-gray-200"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Finish This Ride</h3>
      <div className="flex justify-between items-center mt-4 rounded-lg p-3 bg-yellow-400">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://imgs.search.brave.com/V6qLjB3fqMU_4WUuUDwKoH2OIhnvkD7DwDNdD2iO2Uo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI5/ODA3NDIxNi9waG90/by9wb3J0cmFpdC1v/Zi1mZW1hbGUtYXJj/aGl0ZWN0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz02SW45/VkFiakExNmlicHRh/Um5GSzVzTF9SQ2tU/dUdlbG9qSVhLZi11/ZWpzPQ"
            alt=""
          />
          <h2 className="text-lg font-medium capitalize">
            {props.rideData?.user.fullname.firstname +
              " " +
              props.rideData?.user.fullname.lastname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold text-gray-600">2.2km</h5>
      </div>
      <div className="flex flex-col gap-2 justify-between items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2  ">
            <i className="ri-map-pin-user-fill text-lg"></i>
            <div>
              <h3 className="font-medium text-lg">24B/AA-11</h3>
              <p className="text-sm text-gray-600 -mt-1">
                {props.rideData?.pickup || "Pickup Location"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2  ">
            <i className="ri-map-pin-2-fill text-lg"></i>

            <div>
              <h3 className="font-medium text-lg">24B/AA-11</h3>
              <p className="text-sm text-gray-600 -mt-1">
                {props.rideData?.destination || "Destination Location"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 ">
            <i className="ri-currency-line text-lg"></i>
            <div>
              <h3 className="font-medium text-lg">${props.rideData?.fare}</h3>
              <p className="text-sm text-gray-600 -mt-1">Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full">
          <button
            onClick={endRide}
            className="mt-3 w-full flex justify-center  bg-green-600 text-white font-semibold  p-2 px-6 rounded-lg"
          >
            Finish Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishRide;
