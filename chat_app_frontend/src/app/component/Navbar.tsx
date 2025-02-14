'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { logout, loadUserFromStorage } from "../redux/slice/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { toast } from 'react-toastify';
import LeftSidebar from './LeftSideBar';
import RightSidebar from './RightSideBar';

const Navbar = () => {
  const route = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState(true); // Loading state
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  
    // Set loading to true before dispatching
    setLoading(true);
    dispatch(loadUserFromStorage());
  
    // Listen for changes in isLoggedIn to update loading state
  }, [dispatch]);
  
  useEffect(() => {
    // Set loading to false once isLoggedIn is determined
    setLoading(false);
  }, [isLoggedIn]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Successfully Logout, Thank you for your visit..", {
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        padding: '5px 2px',
        width: '360px',
      },
    });

    setTimeout(() => {
      route.push('/chat/login');
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {isLoggedIn ? (
        <div>
          <LeftSidebar />
          <RightSidebar />
        </div>
      ) : (
        <></>
      )}
      <nav className="bg-white border-gray-900 shadow-sm dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="/logo.png"
              className="h-8 shadow rounded-full"
              alt="Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              SCM
            </span>
          </Link>

          <div className="flex gap-2 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              id="theme_change_button"
              onClick={toggleTheme}
              className="bg-gray-200 px-3 py-2 rounded-lg dark:bg-gray-600"
            >
              <i className="fa-solid fa-circle-half-stroke"></i>{' '}
              <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
            </button>
            {isLoggedIn ? (
              <div>
                <Link href="/chat/user/profile">
                  <button className="text-white bg-blue-500 hover:bg-blue-600 mx-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center">
                    My Profile
                  </button>
                </Link>

                <Link href="#" onClick={handleLogout}>
                  <button className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center">
                    Logout
                  </button>
                </Link>
              </div>
            ) : (
              <div>
                <Link href="/chat/login">
                  <button className="text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm mx-3 px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Login
                  </button>
                </Link>
                <Link href="/chat/signup">
                  <button className="text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Signup
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
