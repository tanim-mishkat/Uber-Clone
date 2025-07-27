import { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainDetails = () => {
  const { captain, isLoading } = useContext(CaptainDataContext);

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading captain info...</p>;
  }

  if (!captain || !captain.fullname) {
    return <p className="text-center text-red-500">Captain data missing</p>;
  }

  const { firstname, lastname } = captain.fullname;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 p-2 ">
        <div className="flex items-center gap-4">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s"
            alt="Captain"
          />
          <h4 className="text-lg font-semibold capitalize">
            {firstname} {lastname}
          </h4>
        </div>
        <div className="text-right">
          <h4 className="text-xl font-bold">₹295.20</h4>
          <p className="text-sm text-gray-500">Earned</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-gray-100 p-2 rounded-lg">
        <div className="text-center">
          <i className="ri-timer-2-line text-2xl font-thin mb-2"></i>
          <h5 className="text-lg font-semibold">10.2</h5>
          <p className="text-sm text-gray-500">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="ri-speed-up-line text-2xl font-thin mb-2"></i>
          <h5 className="text-lg font-semibold">23 km</h5>
          <p className="text-sm text-gray-500">Distance Covered</p>
        </div>
        <div className="text-center">
          <i className="ri-booklet-line text-2xl font-thin mb-2"></i>
          <h5 className="text-lg font-semibold">12</h5>
          <p className="text-sm text-gray-500">Rides Completed</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
