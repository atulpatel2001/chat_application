'use client'; 
import Navbar from "@/app/component/Navbar";
import React from "react";

const Contact: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6  min-h-screen">
        <h2 className="text-2xl font-semibold mb-6 text-center">Contact Us</h2>
        <div className="  overflow-hidden">
          <p>Learn more about our company and team.</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
