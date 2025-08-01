import React from "react";

function LookingForDriver(props) {
  return (
    <div>
      <h5
        onClick={() => props.setVehicleFound(false)}
        className="p-1 text-center absolute top-0 w-[90%] "
      >
        <i className="ri-arrow-down-wide-line text-3xl text-gray-200"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Looking for a driver</h3>
      <div className="flex flex-col gap-2 justify-between items-center">
        <img
          src=" https://imgs.search.brave.com/jbkD8t3qexpL_IRFxMjNwnZXxCWMoIAeUDRRJx3hh3w/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjkv/OTQ2LzE5My9zbWFs/bC93aGl0ZS1tb2Rl/cm4tY2FyLWlzb2xh/dGVkLW9uLXRyYW5z/cGFyZW50LWJhY2tn/cm91bmQtM2QtcmVu/ZGVyaW5nLWlsbHVz/dHJhdGlvbi1mcmVl/LXBuZy5wbmc"
          className="h-20"
        />
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2  ">
            <i className="ri-map-pin-user-fill text-lg"></i>
            <div>
              <h3 className="font-medium text-lg">24B/AA-11</h3>
              <p className="text-sm text-gray-600 -mt-1">
                {props.pickup || "Pickup Location"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2  ">
            <i className="ri-map-pin-2-fill text-lg"></i>

            <div>
              <h3 className="font-medium text-lg">24B/AA-11</h3>
              <p className="text-sm text-gray-600 -mt-1">
                {props.destination || "Destination Location"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 ">
            <i className="ri-currency-line text-lg"></i>
            <div>
              <h3 className="font-medium text-lg">
                {props.fare && props.vehicleType
                  ? `$${props.fare[props.vehicleType]}`
                  : "Fare: N/A"}
              </h3>
              <p className="text-sm text-gray-600 -mt-1">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LookingForDriver;
