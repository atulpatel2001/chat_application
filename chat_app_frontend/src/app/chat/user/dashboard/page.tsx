'use client'; // Ensure this is here
import Navbar from "@/app/component/Navbar";
import React from "react";
import { Line } from 'react-chartjs-2'; // Import Line chart from react-chartjs-2
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// Registering necessary components for Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard: React.FC = () => {
  // Data for the chart (e.g., chat activity)
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'], // Example months on the X-axis
    datasets: [
      {
        label: 'Monthly Chat Activity',
        data: [30, 45, 70, 60, 80, 90], // Example data points (messages or chat interactions)
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chat Activity Overview',
      },
    },
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 min-h-screen">
        <h2 className="text-2xl font-semibold mb-6 text-center">Welcome to Your Dashboard</h2>

        {/* Data Cards for user metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Total Contacts</h3>
            <p className="text-4xl font-bold">1,256</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Messages Sent</h3>
            <p className="text-4xl font-bold">12,432</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Active Users</h3>
            <p className="text-4xl font-bold">453</p>
          </div>
        </div>

        {/* Chat Activity Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Chat Activity Overview</h3>
          <div className="w-full h-64">
            <Line data={data} options={options} />
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Recent Activities</h3>
          <div className="space-y-4">
            {/* Activity Item 1 */}
            <div className="flex justify-between items-center hover:bg-gray-700 p-4 rounded-lg transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">JD</div>
                <p className="text-lg">John Doe added as a contact.</p>
              </div>
              <span className="text-sm text-gray-400">2 hours ago</span>
            </div>
            {/* Activity Item 2 */}
            <div className="flex justify-between items-center hover:bg-gray-700 p-4 rounded-lg transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">J</div>
                <p className="text-lg">You received a new message from Jane.</p>
              </div>
              <span className="text-sm text-gray-400">1 day ago</span>
            </div>
            {/* Activity Item 3 */}
            <div className="flex justify-between items-center hover:bg-gray-700 p-4 rounded-lg transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white">AS</div>
                <p className="text-lg">Contact added: Alex Smith.</p>
              </div>
              <span className="text-sm text-gray-400">3 days ago</span>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-center">Your Chats</h3>
          <div className="space-y-4">
            {/* Chat Item 1 */}
            <div className="flex justify-between items-center hover:bg-gray-700 p-4 rounded-lg transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white">JD</div>
                <div>
                  <p className="text-lg font-semibold">John Doe</p>
                  <p className="text-sm text-gray-400">Hey, let's catch up soon!</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">5 mins ago</span>
            </div>
            {/* Chat Item 2 */}
            <div className="flex justify-between items-center hover:bg-gray-700 p-4 rounded-lg transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-green-400 flex items-center justify-center text-white">JS</div>
                <div>
                  <p className="text-lg font-semibold">Jane Smith</p>
                  <p className="text-sm text-gray-400">I need help with the project!</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">10 mins ago</span>
            </div>
            {/* Chat Item 3 */}
            <div className="flex justify-between items-center hover:bg-gray-700 p-4 rounded-lg transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-red-400 flex items-center justify-center text-white">AS</div>
                <div>
                  <p className="text-lg font-semibold">Alex Smith</p>
                  <p className="text-sm text-gray-400">Meeting at 3 PM tomorrow.</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">1 hour ago</span>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="overflow-hidden mt-8">
          <p className="text-lg">Get in touch with us for more information about your contacts and chat features.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
