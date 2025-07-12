import React, { useContext, useEffect, useRef } from "react";
import robat from "../assets/robat.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(AppContent);
  const inputRef = React.useRef([]);
  const navigate = useNavigate();
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };
  const handlekeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
  };

  const onsubmithandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRef.current.map((e) => e.value);
      const otp = otpArray.join("");
      const res = await axios.post(backendUrl + "/api/auth/verify-account", {
        otp,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(res.data.message);
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData]);

  return (
    <div className="flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={robat}
        alt=""
        onClick={() => navigate("/")}
        className=" sm-w-32 cursor-pointer absolute left-5 sm:left-20 top-5 w-12 rounded-full"
      />
      <form
        onSubmit={onsubmithandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-2xl text-white font-semibold text-center mb-4">
          Email verify Otp
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code sent to your email id.{" "}
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((__, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                ref={(e) => {
                  inputRef.current[index] = e;
                }}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handlekeyDown(e, index)}
                className="w-12 h-12  text-center text-white text-xl bg-[#333A5c] rounded-md "
              />
            ))}
        </div>
        <button className=" bg-gradient-to-r from-indigo-500 to-indigo-900 w-full text-white rounded-full py-3">
          verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
