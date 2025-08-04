import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopUp = (props) => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          params: {
            rideId: props.ride?._id,
            otp: otp,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Ride confirmed successfully:", response.data);
        props.setConfirmRidePopUpPanel(false);
        props.setRidePopUpPanel(false);
        navigate("/captain-riding", {
          state: {
            ride: props.ride,
          },
        });
      }
    } catch (error) {
      console.error(
        "❌ Failed to start ride:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to start ride.");
    }
  };

  return (
    <div>
      <h5
        onClick={() => props.setConfirmRidePopUpPanel(false)}
        className="p-1 text-center absolute top-0 w-[90%] "
      >
        <i className="ri-arrow-down-wide-line text-3xl text-gray-200"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Confirm Ride Request</h3>
      <div className="flex justify-between items-center mt-4 rounded-lg p-3 bg-yellow-400">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://imgs.search.brave.com/V6qLjB3fqMU_4WUuUDwKoH2OIhnvkD7DwDNdD2iO2Uo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI5/ODA3NDIxNi9waG90/by9wb3J0cmFpdC1v/Zi1mZW1hbGUtYXJj/aGl0ZWN0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz02SW45/VkFiakExNmlicHRh/Um5GSzVzTF9SQ2tU/dUdlbG9qSVhLZi11/ZWpzPQ"
            alt=""
          />
          <h2 className="text-lg font-medium capitalize">
            {props.ride?.user.fullname.firstname +
              " " +
              props.ride?.user.fullname.lastname}
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
                {props.ride?.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2  ">
            <i className="ri-map-pin-2-fill text-lg"></i>

            <div>
              <h3 className="font-medium text-lg">24B/AA-11</h3>
              <p className="text-sm text-gray-600 -mt-1">
                {props.ride?.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 ">
            <i className="ri-currency-line text-lg"></i>
            <div>
              <h3 className="font-medium text-lg">$20</h3>
              <p className="text-sm text-gray-600 -mt-1">Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <form action="" onSubmit={(e) => submitHandler(e)}>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              placeholder="Enter your OTP"
              className="bg-[#eee] px-6 py-4 font-mono text-base rounded-lg w-full"
            />
            <button
              onClick={() => {
                props.setConfirmRidePopUpPanel(false);
                props.setRidePopUpPanel(false);
              }}
              className="mt-3 w-full bg-red-500 text-white font-semibold  p-2 px-6 rounded-lg"
            >
              Cancel
            </button>
            <button className="mt-3 w-full flex justify-center  bg-green-600 text-white font-semibold  p-2 px-6 rounded-lg">
              Confirm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
