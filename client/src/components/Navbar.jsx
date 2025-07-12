import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import robat from "../assets/robat.jpg";
import { toast } from "react-toastify";
import axios from "axios";
const Navbar = () => {
  const navigate = useNavigate();

  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(backendUrl + "/api/auth/send-verify-otp");
      if (res.data.success) {
        navigate("/email-verify");
        toast.success(res.data.message);
      } else {
        toast.error(es.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(backendUrl + "/api/auth/logout");
      if (res.data.success) {
        setIsLoggedin(false);
        setUserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex justify-between items-center w-full p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={robat} alt="" className="w-[50px]" />
      {userData ? (
        <div className="w-10 h-10 flex items-center rounded-full text-white bg-black justify-center relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="bg-gray-100 text-sm m-0 p-2 list-none  ">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1  hover:bg-gray-200 cursor-pointer "
                >
                  verify email
                </li>
              )}

              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="border text-xl text-gray-800 hover:bg-gray-100  border-gray-600 rounded-full px-8 py-2.5"
        >
          login
        </button>
      )}
    </div>
  );
};

export default Navbar;
