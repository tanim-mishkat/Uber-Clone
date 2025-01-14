import { useState } from "react";
import { Link } from "react-router-dom";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();
    setUserData({
      fullName: {
        firstName: Firstname,
        lastName: Lastname,
      },
      email: email,
      password: password,
    });
    console.log(userData);
    setEmail("");
    setPassword("");
    setFirstname("");
    setLastname("");
  };

  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img
          className="w-16 mb-10"
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt=""
        />
        <form onSubmit={(e) => submitHandler(e)}>
          <h3 className="text-base mb-2 font-medium">What`s Your Name</h3>
          <div className="flex gap-3 mb-5">
            <input
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm"
              type="text"
              placeholder="Firstname"
              required
              value={Firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm"
              type="text"
              placeholder="Lastname"
              value={Lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>

          <h3 className="text-base mb-2 font-medium">What`s Your Email</h3>
          <input
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
            type="email"
            placeholder="youremail@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h3 className="text-base mb-2 font-medium">Enter Your Password</h3>
          <div className="relative flex items-center">
            <input
              className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-base placeholder:text-sm pr-12"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="text-sm absolute right-3 top-2 text-blue-600 cursor-pointer z-10"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg ">
            Login
          </button>

          <p className="text-center">
            Already have an account?{" "}
            <Link className="text-blue-600" to="/login">
              Login here
            </Link>
          </p>
        </form>
      </div>

      <div>
        <p className="text-center text-xs leading-tight">
          By proceeding, you agree to our Privacy Policy and Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
