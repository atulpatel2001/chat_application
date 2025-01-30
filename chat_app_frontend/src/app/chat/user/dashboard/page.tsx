'use client';
import Navbar from "@/app/component/Navbar";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6  min-h-screen">
        <h2 className="text-2xl font-semibold mb-6 text-center">Dashboard</h2>
        <div className="  overflow-hidden">
          <p>Get in touch with us for more information.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
