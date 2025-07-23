import React from "react";

export const CaptainDetails = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6 p-2 ">
        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://imgs.search.brave.com/V6qLjB3fqMU_4WUuUDwKoH2OIhnvkD7DwDNdD2iO2Uo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI5/ODA3NDIxNi9waG90/by9wb3J0cmFpdC1v/Zi1mZW1hbGUtYXJj/aGl0ZWN0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz02SW45/VkFiakExNmlicHRh/Um5GSzVzTF9SQ2tU/dUdlbG9qSVhLZi11/ZWpzPQ"
            alt="Captain"
          />
          <h4 className="text-lg font-semibold">Mishkat Rahman</h4>
        </div>

        {/* Earnings */}
        <div className="text-right">
          <h4 className="text-xl font-bold">$2323</h4>
          <p className="text-sm text-gray-500">Earned</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 bg-gray-100 p-2 rounded-lg">
        <div className="text-center">
          <i className="ri-timer-2-line text-2xl font-thin  mb-2"></i>
          <h5 className="text-lg font-semibold">10.2</h5>
          <p className="text-sm text-gray-500">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="ri-speed-up-line text-2xl font-thin  mb-2"></i>
          <h5 className="text-lg font-semibold">23 km</h5>
          <p className="text-sm text-gray-500">Distance Covered</p>
        </div>
        <div className="text-center">
          <i className="ri-booklet-line text-2xl font-thin  mb-2"></i>
          <h5 className="text-lg font-semibold">12</h5>
          <p className="text-sm text-gray-500">Rides Completed</p>
        </div>
      </div>
    </div>
  );
};
