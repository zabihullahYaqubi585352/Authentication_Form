import React, { useContext } from "react";
import robot from "../assets/robat.jpg"; // Assuming you have a robot image in the assets folder
import { AppContent } from "../context/AppContext";

const Header = () => {
  const { userData } = useContext(AppContent);
  return (
    <div className="flex flex-col items-center  ">
      <img src={robot} alt="robot image " className="w-[140px]" />
      <h1 className="text-xl sm:text-3xl font-medium mb-2">
        Hey {userData ? userData.name : "Developer!"}
      </h1>
      <h1 className="text-3xl sm:text-5xl font-semibold mb-4 ">
        Wellcome to our app
      </h1>
      <p className="mb-8 max-w-md text-xl">
        Let`s start with quick product tour and we will have up you and running
        no time
      </p>
      <button className=" text-xl border border-gray-500  rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all ">
        Get Started
      </button>
    </div>
  );
};

export default Header;
