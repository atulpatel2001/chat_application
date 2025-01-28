'use client'; // Ensure this is here

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loadUserFromStorage, login_, User } from '@/app/redux/slice/authSlice';

const LoginSuccess = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');

        if (token) {
            const userName = searchParams.get('userName');
            const userId = searchParams.get('userId');
            const userData: User = {
                id: userId || "",
                email: userName || "",
            }
            dispatch(
                login_({
                    user: userData,
                    token: token,
                })
            );

            dispatch(loadUserFromStorage())
            
            router.push('/chat/user/dashboard'); 
        } else {
            console.error('No token found in URL');
            router.push('/chat/login');
        }
    }, [router,dispatch]);

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

export default LoginSuccess;
