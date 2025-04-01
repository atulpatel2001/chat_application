'use client'; 
import Navbar from "@/app/component/Navbar";
import React from "react";
import { motion } from "framer-motion"; // Importing framer-motion for motion effects
import Link from "next/link"; // Import Link from next/link

const Dashboard: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="max-w-7xl mx-auto p-12 flex justify-between items-center">
          {/* Left Section */}
          <div className="w-1/2 pr-8">
            <motion.h2 
              className="text-5xl font-bold mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 1 }}>
              Welcome to Your Smart Contact Hub
            </motion.h2>

            <motion.p 
              className="text-xl mb-6 max-w-3xl mx-auto tracking-wide" 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 1, delay: 0.5 }}>
              Manage your contacts effortlessly with our intuitive Contact Management System. Add, organize, and search for contacts in seconds. Whether you're handling personal connections or business relations, we’ve made it easy for you to stay on top of your network.
            </motion.p>
            
            <motion.p 
              className="text-lg mb-8 max-w-2xl mx-auto tracking-wide" 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 1, delay: 1 }}>
              Seamlessly chat with your contacts in real-time. From one-on-one conversations to group chats, track message statuses (Sent, Delivered, Read) and ensure every communication is organized. Experience efficient messaging and contact management all in one place.
            </motion.p>
          </div>

          {/* Right Section with Link */}
          <div className="w-1/2 pl-8 text-center">
            <motion.div 
              className="mt-12"
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ duration: 0.8 }}>
              {/* Wrap the button with Link component for routing */}
              <Link href="/chat/login">
                <button className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg text-lg hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-xl">
                  Start Managing Contacts
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
