import React, { useContext, useState } from "react";
import robat from "../assets/robat.jpg";
import Email from "../assets/email.png";
import lock from "../assets/lock.png";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ResetPassword = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl } = useContext(AppContent);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl + "/api/auth/send-reset-otp", {
        email,
      });
      res.data.success
        ? toast.success(res.data.message)
        : toast.error(res.data.message);
      res.data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArry = inputRef.current.map((e) => e.value);
    setOtp(otpArry.join(""));
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl + "/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      res.data.success
        ? toast.success(res.data.message)
        : toast.error(res.data.message);
      res.data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={robat}
        alt=""
        onClick={() => navigate("/")}
        className=" sm-w-32 cursor-pointer absolute left-5 sm:left-20 top-5 w-12 rounded-full"
      />
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-2xl text-white font-semibold text-center mb-4">
            Reset password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>

          <div className="mb-4 flex items-center gap-3 px-5 py-2.5 w-full rounded-full bg-[#333A5c]">
            <img src={Email} alt="Email-id" className="w-3 h-3 fill-white" />
            <input
              type="email"
              placeholder="Email-id "
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              className="bg-transparent outline-none text-white "
            />
          </div>
          <button className=" bg-gradient-to-r from-indigo-500 to-indigo-900 w-full text-white rounded-full py-3">
            Submit
          </button>
        </form>
      )}

      {!isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-2xl text-white font-semibold text-center mb-4">
            Reset password Otp
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
            submit
          </button>
        </form>
      )}

      {isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-2xl text-white font-semibold text-center mb-4">
            New password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the new paaword below
          </p>

          <div className="mb-4 flex items-center gap-3 px-5 py-2.5 w-full rounded-full bg-[#333A5c]">
            <img src={lock} alt="Email-id" className="w-3 h-3 fill-white" />
            <input
              type="password"
              placeholder="password "
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              required
              className="bg-transparent outline-none text-white "
            />
          </div>
          <button className=" bg-gradient-to-r from-indigo-500 to-indigo-900 w-full text-white rounded-full py-3">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
