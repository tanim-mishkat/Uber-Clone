const LocationSearchPanel = ({
  suggestions,
  onSuggestionClick,
  pickup,
  destination,
  setVehiclePanel,
  setPanelOpen,
  findTrip,
}) => {
  const handleFindRideClick = async () => {
    if (pickup.trim() && destination.trim()) {
      await findTrip(); // Call findTrip to fetch fare
      setPanelOpen(false);
      setVehiclePanel(true);
    } else {
      alert("Please select both pickup and destination");
    }
  };

  return (
    <div className="flex flex-col justify-between px-4 py-2 h-full">
      <div className="overflow-y-auto">
        {suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <i className="ri-map-pin-2-line text-2xl text-gray-500"></i>
            </div>
            <p className="text-gray-500 text-sm">Enter a location to search</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 px-2 mb-4">
              <i className="ri-search-line text-gray-400"></i>
              <p className="text-sm text-gray-500">Search results</p>
            </div>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="bg-gray-100 p-2 rounded-full">
                  <i className="ri-map-pin-line text-lg text-gray-600"></i>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-medium text-gray-900">
                    {suggestion.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {[suggestion.city, suggestion.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <button
        onClick={handleFindRideClick}
        className={`mt-4 w-full bg-black text-white py-3 rounded-full text-base font-semibold flex justify-center items-center gap-2 hover:bg-gray-900 transition ${
          !pickup || !destination ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <i className="ri-steering-2-fill text-xl"></i>
        Find a Ride
      </button>
    </div>
  );
};

export default LocationSearchPanel;
