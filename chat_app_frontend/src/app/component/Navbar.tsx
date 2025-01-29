'use client'; // Ensure this is here

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // usePathname instead of useRouter
import Link from 'next/link';
import { logout, loadUserFromStorage } from "../redux/slice/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { toast } from 'react-toastify';

const Navbar = () => {
  const route = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const pathname = usePathname(); // Using usePathname from next/navigation instead of useRouter()

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);


  };
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Successfully Logout ,Thank you for your visit..", {
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

  return (
    <>
      <nav className="bg-white border-gray-900 shadow-sm dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Brand */}
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

          {/* Right-side buttons */}
          <div className="flex gap-2 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {/* Theme toggle button */}
            <button
              id="theme_change_button"
              onClick={toggleTheme}
              className="bg-gray-200 px-3 py-2 rounded-lg dark:bg-gray-600"
            >
              <i className="fa-solid fa-circle-half-stroke"></i>{' '}
              <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
            </button>
            {isLoggedIn ? (
              // Render content for logged-in users
            
              <div>
                <Link href="/chat/contacts/add_contact">
                  <button className="text-white bg-blue-500 hover:bg-blue-600 mx-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center">
                    Add Contact
                  </button>
                </Link>
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
              // Render content for guests (not logged in)
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
            {/* Mobile menu button */}
            <button
              data-collapse-toggle="navbar-cta"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-cta"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          {/* Navbar links */}
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-cta"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {[
                { href: isLoggedIn ? '/chat/user/dashboard' : '/chat/home ', label: 'Home' },
                { href: '/chat/about', label: 'About' },
                { href: '/chat/services', label: 'Services' },
                { href: '/chat/contact', label: 'Contact' }
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block py-2 px-3 md:p-0 ${pathname === link.href
                      ? 'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                      : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                      }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

    </>
  );
};

export default Navbar;
