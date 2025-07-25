const VehiclePanel = (props) => {
  return (
    <div>
      <h5
        onClick={() => props.setVehiclePanel(false)}
        className="p-1 text-center absolute top-0 w-[90%] "
      >
        <i className="ri-arrow-down-wide-line text-3xl text-gray-200"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Choose a vehicle</h3>
      <div
        onClick={() => props.setConfirmRidePanel(true)}
        className="flex items-center justify-between w-full p-3 border-2 bg-gray-100 rounded-xl mb-2 active:border-black"
      >
        <img
          className="h-10"
          src="https://imgs.search.brave.com/jbkD8t3qexpL_IRFxMjNwnZXxCWMoIAeUDRRJx3hh3w/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjkv/OTQ2LzE5My9zbWFs/bC93aGl0ZS1tb2Rl/cm4tY2FyLWlzb2xh/dGVkLW9uLXRyYW5z/cGFyZW50LWJhY2tn/cm91bmQtM2QtcmVu/ZGVyaW5nLWlsbHVz/dHJhdGlvbi1mcmVl/LXBuZy5wbmc"
          alt=""
        />
        <div className=" w-1/2 ml-2">
          <h4 className="font-medium text-base">
            UberGo{" "}
            <span>
              <i className="ri-user-3-fill"></i>4
              <h5 className="font-medium text-sm">2 mins away </h5>
              <p className="font-normal text-xs text=grey-600">
                affordable compact rides
              </p>
            </span>
          </h4>
        </div>
        <h2 className="font-semibold text-lg">
          BDT {props.fare?.car || "N/A"}
        </h2>
      </div>
      <div
        onClick={() => props.setConfirmRidePanel(true)}
        className="flex items-center justify-between w-full p-3 border-2 bg-gray-100 rounded-xl mb-2 active:border-black"
      >
        <img
          className="h-10"
          src="https://www.uber-assets.com/image/upload/f_auto%2Cq_auto%3Aeco%2Cc_fill%2Ch_538%2Cw_956/v1698944322/assets/92/00189a-71c0-4f6d-a9de-1b6a85239079/original/UberMoto-India-Orange.png"
          alt=""
        />
        <div className=" w-1/2 ml-2">
          <h4 className="font-medium text-base">
            UberMoto{" "}
            <span>
              <i className="ri-user-3-fill"></i>2
              <h5 className="font-medium text-sm">5 mins away </h5>
              <p className="font-normal text-xs text=grey-600">
                affordable motorcycle rides
              </p>
            </span>
          </h4>
        </div>
        <h2 className="font-semibold text-lg">
          BDT {props.fare?.motorcycle || "N/A"}
        </h2>
      </div>
      <div
        onClick={() => props.setConfirmRidePanel(true)}
        className="flex items-center justify-between w-full p-3 border-2 bg-gray-100 rounded-xl mb-2 active:border-black"
      >
        <img
          className="h-10"
          src="https://images.openai.com/thumbnails/url/HYbWD3icu1mSUVJSUGylr5-al1xUWVCSmqJbkpRnoJdeXJJYkpmsl5yfq5-Zm5ieWmxfaAuUsXL0S7F0Tw4MSvctLnV1cgyMMCwN8E30yynNSa_I8kk1dvW0KCvJyM4xqnCL9HDMMfc1SPSL940szSxNi3D0dglwDFQrBgAoSioF"
          alt=""
        />
        <div className=" w-1/2 ml-2">
          <h4 className="font-medium text-base">
            UberCNG{" "}
            <span>
              <i className="ri-user-3-fill"></i>5
              <h5 className="font-medium text-sm">1 mins away </h5>
              <p className="font-normal text-xs text=grey-600">
                affordable motorcycle rides
              </p>
            </span>
          </h4>
        </div>
        <h2 className="font-semibold text-lg">
          BDT {props.fare?.cng || "N/A"}
        </h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
