const LocationSearchPanel = (props) => {

  const locations = [
    "24B, near kapoor cafe, coding school, sylhet",
    "25A, near coding academy, downtown, city",
    "26C, beside the park, main street, metropolis",
  ];

  return (
    <div>
      {/* just sample data */}

      {locations.map((location, index) => (
        <div
          onClick={() => {
            props.setVehiclePanel(true);
            props.setPanelOpen(false);
          }}
          key={index}
          className="flex items-center justify-start gap-4 my-2 border-2 px-2 rounded-xl border-gray-50 active:border-black"
        >
          <h2 className="bg-[#eee] flex items-center justify-center h-8 w-12 rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">{location}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
