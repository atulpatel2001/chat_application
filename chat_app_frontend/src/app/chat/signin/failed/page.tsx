'use client'; // Ensure this is here

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const LoginFailed = () => {
    const router = useRouter();

    useEffect(() => {
        toast.error("Login Failed , Please try again after some time.", {
            style: {
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '5px 2px',
                width: '360px',
            },
        });
           router.push('/chat/login');
    }, [router]);

    return (
        <div className="relative w-full h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-lg"></div>
            <div className="relative z-10 text-center">
                <div className="animate-spin rounded-full border-4 border-t-transparent border-white h-12 w-12 mb-6"></div>
                <h1 className="text-white text-2xl font-semibold">
                    Processing your login...
                </h1>
                <p className="text-white text-sm opacity-90 mt-2">
                    Please wait while we authenticate your details.
                </p>
            </div>
        </div>
    );
};

export default LoginFailed;
