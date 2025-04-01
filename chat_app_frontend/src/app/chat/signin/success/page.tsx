'use client'; // Ensure this is here

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loadUserFromStorage, login_, User } from '@/app/redux/slice/authSlice';
import Loader from '@/app/component/Loader';

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

            dispatch(loadUserFromStorage());
            
            router.push('/chat/user/dashboard'); 
        } else {
            console.error('No token found in URL');
            router.push('/chat/login');
        }
    }, [router,dispatch]);

    return (
        <div className="relative w-full h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white flex items-center justify-center overflow-hidden">
            <div className="absolute text-center z-10">
                <h1 className="text-3xl font-semibold mb-4">Logging you in...</h1>
                <p className="text-lg">Please wait while we verify your credentials and redirect you to your dashboard.</p>
            </div>
            <Loader />
        </div>
    );
};

export default LoginSuccess;
