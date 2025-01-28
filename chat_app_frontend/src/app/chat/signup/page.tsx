'use client';
import Navbar from "@/app/component/Navbar";
import { signin } from "@/app/services/AuthService";
import React, { useState } from "react";
import { toast } from 'react-toastify';
export interface UserForm {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface ValidationError {
  [key: string]: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    phoneNumber: ""
  });

  const [errors, setErrors] = useState<ValidationError>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signin(formData);
    if (!result.success) {
      if (result.errors) {
        if(result.field){
           setErrors(result.errors);
        }else{
            toast.error(result.errors, {
              style: {
                fontSize: '12px',
                fontWeight:'bold',
                padding: '5px 2px',
                width: '500px',
              },
            });
        }
      } else {
        toast.error("Registration Failed!!");
        handleReset();
      }
    } else {
        toast.success(result.message);
        handleReset();
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phoneNumber: ""
    });
    setErrors({});
  };

  return (<>
  <Navbar/>
    <div className="flex justify-center mt-8">
      <div className="w-full max-w-lg p-6 border-t-4 border-blue-700 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-blue-700">
        <h5 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Signup Here</h5>
        <p className="mb-6 text-sm text-gray-400 dark:text-gray-400">Start managing contacts on cloud...</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter here"
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@flowbite.com"
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Contact Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="px-4 py-2 font-medium text-white bg-gray-800 rounded hover:bg-gray-700 dark:bg-blue-800 dark:hover:bg-blue-700"
            >
              Signup
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 font-medium text-white bg-orange-800 rounded hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default Signup;
