'use client'; // Ensure this is here

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const LoginFailed = () => {
    const router = useRouter();

    useEffect(() => {
        toast.error("Login Failed, Please try again after some time.", {
            style: {
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '5px 2px',
                width: '360px',
            },
        });

        // Redirect after toast message
        setTimeout(() => {
            router.push('/chat/login');
        }, 3000); // Wait for 3 seconds before redirecting
    }, [router]);

    return (
        <div className="relative w-full h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-lg"></div>
            <div className="relative z-10 text-center">
                {/* Spin animation for loader */}
                <div className="animate-spin rounded-full border-4 border-t-transparent border-white h-16 w-16 mb-6"></div>

                {/* Main content */}
                <h1 className="text-white text-3xl font-semibold mb-4">Oops! Something went wrong</h1>
                <p className="text-white text-sm opacity-90 mb-6">Please wait while we redirect you back to the login page.</p>

                {/* Loading indicator */}
                <div className="text-white text-lg font-medium opacity-80">
                    <p>Processing your login...</p>
                </div>
            </div>
        </div>
    );
};

export default LoginFailed;
