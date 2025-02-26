'use client';
import Navbar from '@/app/component/Navbar';
import { login, thirdPartyLogin } from '@/app/services/AuthService';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
interface ValidationError {
    [key: string]: string;
}
export interface LoginFormData {
    email: string;
    password: string;
}

const LoginForm = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
    const [errors, setErrors] = useState<ValidationError>({});
    const [loading, setLoading] = useState(false);




    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        const response = await login(formData, dispatch);
        console.log(response)
        if (response != undefined) {
            if (response.success == true) {
                toast.success(response.message);
                window.location.href = "/chat/user/dashboard";
            } else {
                if (response.field == true) {
                    setErrors(response.errors);

                } else {
                    toast.error(response.message, {
                        style: {
                            fontSize: '12px',
                            fontWeight: 'bold',
                            padding: '5px 2px',
                            width: '300px',
                        },
                    });
                }
            }
        }
        setLoading(false);
    };


    const handleThirdPartyAuth = async (providerType: string) => {
        const response = await thirdPartyLogin(providerType)
        console.log(response);
        setLoading(true);

    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (<>

        <Navbar />
        <div >
            <div className="grid grid-cols-12 mt-4">
                <div className="col-span-4 md:col-span-2 lg:col-span-3 xl:col-span-4"></div>
                <div className="col-span-12 md:col-span-8 lg:col-span-6 xl:col-span-4">
                    {/* Card Layout */}
                    <div className="block p-6 border-t-[10px] border-green-700 bg-white rounded-xl shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-blue-700 dark:hover:bg-gray-700">
                        {/* Error Message */}
                        {/* {error && <div className="text-red-600 text-center my-3">{error}</div>} */}

                        {/* Title and Description */}
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Login Here
                        </h5>
                        <p className="font-normal text-gray-400 dark:text-gray-400">
                            Start managing contacts on cloud ...
                        </p>

                        {/* Error Display */}
                        <div className="text-red-600 text-center my-3">
                            {/* Conditionally show error messages */}
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="login-form mt-5">
                            {/* Email Field */}
                            <div className="mb-3">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@flowbite.com"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="mb-3">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="mb-3 flex justify-center space-x-3">
                                <button
                                    type="submit"
                                    className={`px-3 py-2 rounded bg-gray-800 hover:bg-gray text-white ${loading ? 'opacity-50' : ''}`}
                                    disabled={loading}
                                >
                                    Login
                                </button>
                                <button
                                    type="reset"
                                    className="px-3 py-2 rounded bg-orange-800 hover:bg-orange text-white dark:bg-orange-800 dark:hover:bg-orange-800"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>

                        {/* Social Login Buttons */}
                        <div className="social-login-container flex justify-center items-center flex-col space-y-4 mt-10">
                            <a
                                onClick={(event) => {
                                    event.preventDefault();
                                    handleThirdPartyAuth("google");
                                }}
                                href='#'
                                className="py-2 px-2 w-1/2 flex justify-center items-center bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" fill="currentColor" className="mr-2" width="20" height="20">
                                    <path d="M488 261.8c0-17.6-1.6-34.9-4.6-51.6H249.2v97.6h136.7c-5.9 31.7-23.9 58.4-51 76.3v63.4h82.5c48.2-44.4 76.6-109.8 76.6-185.7z" />
                                    <path d="M249.2 492c66.5 0 122.4-21.8 163.2-59.1l-82.5-63.4c-22.9 15.3-52.2 24.4-80.7 24.4-61.6 0-113.7-41.5-132.5-97.3H34.6v61.3C73.3 430.1 155.7 492 249.2 492z" />
                                    <path d="M116.7 296.6c-6.8-20.4-6.8-42.6 0-62.9V172.4H34.6c-25.3 48.3-25.3 106.7 0 155l82.1-30.8z" />
                                    <path d="M249.2 97.9c35.9-.6 70.5 13.5 96.9 38.6l73.5-73.5C375.5 22.9 313.2 0 249.2 0 155.7 0 73.3 61.9 34.6 150.9l82.1 61.3c18.8-55.8 70.9-97.3 132.5-97.3z" />
                                </svg>
                                Sign in with Google
                            </a>
                            <a
                                onClick={(event) => {
                                    event.preventDefault();
                                    handleThirdPartyAuth("github");
                                }}
                                href='#'
                                className="py-2 px-2 w-1/2 flex justify-center items-center bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 1792 1792">
                                    <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
                                </svg>
                                Sign in with GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div></>
    );
};

export default LoginForm;
