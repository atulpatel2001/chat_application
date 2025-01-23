'use client'; 
import Navbar from "@/app/component/Navbar";
import React from "react";

const Home_: React.FC = () => {
  return (
    <div>
      <Navbar/>
      <h1>Welcome to the Home Page!</h1>
      <p>This is the main landing page of your website.</p>
    </div>
  );
};

export default Home_;
