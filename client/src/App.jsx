import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toast-custom.css"; //  your custom styles
import { toast } from "react-toastify"; // Importing toast for notifications
import { AppContent } from "./context/AppContext"; // Importing the context
const App = () => {
  const navigate = useNavigate();
  const { getUserData, setIsLoggedin } = useContext(AppContent); // Ensure context is used to avoid warnings
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const loggedIn = params.get("loggedIn");

    if (loggedIn === "google" || loggedIn === "github") {
      toast.success(`✅ Logged in with ${loggedIn}`);

      // 🔁 Call getUserData from context
      getUserData(); // Make sure this sets user info globally

      //  Set login state
      setIsLoggedin(true);

      //  Navigate to home
      navigate("/");
    }
  }, [location]);
  return (
    <div className="text-4xl">
      <ToastContainer
        toastClassName="custom-toast" //  apply custom class
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
