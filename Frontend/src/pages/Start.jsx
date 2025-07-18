import { Link } from "react-router-dom";

export const Start = () => {
  return (
    <div>
      <div
        className="h-screen w-full pt-5 flex justify-between flex-col
      bg-[url(https://plus.unsplash.com/premium_photo-1680430094293-728b61a2bd8c?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHRyYWZmaWMlMjBsaWdodHxlbnwwfHwwfHx8MA%3D%3D)] 
      bg-cover bg-center"
      >
        <img
          className="w-16 ml-5"
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt=""
        />
        <div className="bg-white pb-7 py-3 px-3">
          <h2 className="text-3xl font-bold">Get Started with Uber</h2>
          <Link
            className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5"
            to="/login"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};
