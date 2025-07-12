import React, { useContext, useEffect, useState } from "react";
import Email from "../assets/email.png"; // Assuming you have an email image in the assets folder
import lock from "../assets/lock.png"; // Assuming you have a lock image in the assets folder
import person from "../assets/person.png"; // Assuming you have a person image in the assets folder
import { data, useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext"; // Importing the context
import axios from "axios";
import { toast } from "react-toastify"; // Importing toast for notifications
const login = () => {
  const { backendUrl, isLoggedin, setIsLoggedin, getUserData, userData } =
    useContext(AppContent);
  const navigate = useNavigate();
  const [state, setState] = useState("Sign up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      if (state === "Sign up") {
        const res = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (res.data.success) {
          toast.success(res.data.message);
          setIsLoggedin(true);
          navigate("/");
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      } else {
        const res = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (res.data.success) {
          toast.success(res.data.message);
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      }
    } catch (error) {
      toast.error("Request failed");
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData]);

  return (
    <div className="flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl text-center text-white font-semibold mb-3">
          {state === "Sign up" ? "Create account" : "Login"}
        </h2>
        <p className="text-center mb-6 text-sm">
          {state === "Sign up"
            ? "Create your account"
            : "Login to your account!"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign up" && (
            <div className="mb-4 flex items-center gap-3 px-5 py-2.5 w-full rounded-full bg-[#333A5c]">
              <img src={person} alt="" className="w-[20px] fill-white" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full name"
                required
                className="bg-transparent outline-none "
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 px-5 py-2.5 w-full rounded-full bg-[#333A5c]">
            <img src={Email} alt="" className="w-[20px] " />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              placeholder="Email-id"
              required
              className="bg-transparent outline-none "
            />
          </div>
          <div className="mb-4 flex items-center gap-3 px-5 py-2.5 w-full rounded-full bg-[#333A5c]">
            <img src={lock} alt="" className="w-[20px] fill-white " />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="text"
              placeholder="password"
              required
              className="bg-transparent outline-none "
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password
          </p>
          <button className="w-full rounded-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white text-medium">
            {state}
          </button>
        </form>
        {state === "Sign up" ? (
          <p className="text-center mt-4 text-xs text-gray-400">
            Already have account?{"  "}{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-center mt-4 text-xs text-gray-400">
            Don`t have an account?{"  "}{" "}
            <span
              onClick={() => setState("Sign up")}
              className="text-blue-400 cursor-pointer underline"
            >
              sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default login;
