import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";
import MobileFrame from "../components/layout/MobileFrame";

const CaptainSignup = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const [formErrors, setFormErrors] = useState({});

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData
      );

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", "captain");
        navigate("/captain-home");
      }
    } catch (error) {
      const validationErrors = error.response?.data?.errors || [];
      const errorMap = {};
      validationErrors.forEach((err) => {
        errorMap[err.path] = err.msg;
      });
      setFormErrors(errorMap);
    }
  };

  return (
    <MobileFrame>
      <div className="py-5 px-5 h-screen flex flex-col justify-between">
        <div>
          <img
            className="w-20 mb-3"
            src="https://www.svgrepo.com/show/505031/uber-driver.svg"
            alt="Uber Captain"
          />

          <form onSubmit={submitHandler}>
            {/* Name */}
            <h3 className="text-lg font-medium mb-2">
              What’s our Captain’s name
            </h3>
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <input
                  required
                  className="bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg placeholder:text-base w-full"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFormErrors((prev) => ({
                      ...prev,
                      "fullname.firstname": null,
                    }));
                  }}
                />
                {formErrors["fullname.firstname"] && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors["fullname.firstname"]}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <input
                  required
                  className="bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg placeholder:text-base w-full"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setFormErrors((prev) => ({
                      ...prev,
                      "fullname.lastname": null,
                    }));
                  }}
                />
                {formErrors["fullname.lastname"] && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors["fullname.lastname"]}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <h3 className="text-lg font-medium mb-2">Captain’s email</h3>
            <input
              required
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFormErrors((prev) => ({ ...prev, email: null }));
              }}
              className="bg-[#eeeeee] mb-1 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            />
            {formErrors["email"] && (
              <p className="text-sm text-red-600 mb-2">{formErrors["email"]}</p>
            )}

            {/* Password */}
            <h3 className="text-lg font-medium mb-2">Enter Password</h3>
            <input
              required
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormErrors((prev) => ({ ...prev, password: null }));
              }}
              className="bg-[#eeeeee] mb-1 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            />
            {formErrors["password"] && (
              <p className="text-sm text-red-600 mb-2">
                {formErrors["password"]}
              </p>
            )}

            {/* Vehicle */}
            <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <input
                  required
                  type="text"
                  placeholder="Vehicle Color"
                  value={vehicleColor}
                  onChange={(e) => {
                    setVehicleColor(e.target.value);
                    setFormErrors((prev) => ({
                      ...prev,
                      "vehicle.color": null,
                    }));
                  }}
                  className="bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg placeholder:text-base w-full"
                />
                {formErrors["vehicle.color"] && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors["vehicle.color"]}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <input
                  required
                  type="text"
                  placeholder="Vehicle Plate"
                  value={vehiclePlate}
                  onChange={(e) => {
                    setVehiclePlate(e.target.value);
                    setFormErrors((prev) => ({
                      ...prev,
                      "vehicle.plate": null,
                    }));
                  }}
                  className="bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg placeholder:text-base w-full"
                />
                {formErrors["vehicle.plate"] && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors["vehicle.plate"]}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <input
                  required
                  type="number"
                  placeholder="Vehicle Capacity"
                  value={vehicleCapacity}
                  onChange={(e) => {
                    setVehicleCapacity(e.target.value);
                    setFormErrors((prev) => ({
                      ...prev,
                      "vehicle.capacity": null,
                    }));
                  }}
                  className="bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg placeholder:text-base w-full"
                />
                {formErrors["vehicle.capacity"] && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors["vehicle.capacity"]}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <select
                  required
                  value={vehicleType}
                  onChange={(e) => {
                    setVehicleType(e.target.value);
                    setFormErrors((prev) => ({
                      ...prev,
                      "vehicle.vehicleType": null,
                    }));
                  }}
                  className="bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg placeholder:text-base w-full"
                >
                  <option value="" disabled>
                    Select Vehicle Type
                  </option>
                  <option value="car">Car</option>
                  <option value="cng">CNG</option>
                  <option value="motorcycle">Moto</option>
                </select>
                {formErrors["vehicle.vehicleType"] && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors["vehicle.vehicleType"]}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg"
            >
              Create Captain Account
            </button>
          </form>

          <p className="text-center">
            Already have an account?{" "}
            <Link to="/captain-login" className="text-blue-600">
              Login here
            </Link>
          </p>
        </div>

        <div>
          <p className="text-[10px] mt-6 leading-tight">
            This site is protected by reCAPTCHA and the{" "}
            <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </MobileFrame>
  );
};

export default CaptainSignup;
