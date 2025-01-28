'use client';
import Navbar from "@/app/component/Navbar";
import { User } from "@/app/model/User";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const Profile: React.FC = () => {
    // Set initial state for the profile
    const [userProfile, setUserProfile] = useState<User>({
        profilePic: "/logo.png",
        phoneNumber: "123-456-7890",
        password: "********",
        name: "John Doe",
        email: "john.doe@example.com",
        provider: "google",
        userId: "151565nhbfhbfd"
    });
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const [newImage, setNewImage] = useState<File | null>(null);
    const [newPhoneNumber, setNewPhoneNumber] = useState<string>(userProfile.phoneNumber);
    const [newUsername, setNewUsername] = useState<string>(userProfile.name);

    //   // Fetch user profile on component mount
    //   useEffect(() => {
    //     const fetchUserProfile = async () => {
    //       try {
    //         const response = await fetch("/api/user");  // Replace with your API endpoint
    //         if (response.ok) {
    //           const data = await response.json();
    //           setUserProfile(data);
    //         } else {
    //           console.error("Failed to fetch user profile");
    //         }
    //       } catch (error) {
    //         console.error("Error fetching user profile:", error);
    //       }
    //     };

    //     fetchUserProfile();
    //   }, []);

    // Handle image change
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
            setUserProfile((prevProfile) => ({
                ...prevProfile,
                profilePic: URL.createObjectURL(file),
            }));
        }
    };

    // Handle phone number change
    const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPhoneNumber(e.target.value);
    };

    // Handle username change
    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewUsername(e.target.value);
    };

    // Handle form submit (update profile)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedProfile = {
            ...userProfile,
            phoneNumber: newPhoneNumber,
            name: newUsername,
            profilePic: newImage ? URL.createObjectURL(newImage) : userProfile.profilePic,
            userId: userProfile.userId
        };

        console.log(updatedProfile);
        // try {
        //   const response = await fetch("/api/user", {
        //     method: "PUT",  // Assuming you use PUT to update the profile
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(updatedProfile),
        //   });

        //   if (response.ok) {
        //     console.log("Profile updated successfully:", updatedProfile);
        //     setUserProfile(updatedProfile);  // Update state with the new profile
        //   } else {
        //     console.error("Failed to update profile");
        //   }
        // } catch (error) {
        //   console.error("Error updating profile:", error);
        // }

    };


    const handleImageClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    };

    return (
        <><Navbar />
            <div id="content">
                <div className="grid grid-cols-12 mt-4">
                    <div className="col-span-4 md:col-span-2 lg:col-span-3 xl:col-span-4"></div>
                    <div className="col-span-12 md:col-span-8 lg:col-span-6 xl:col-span-5">
                        {/* Card Layout */}
                        <div className="block p-6 border-t-[10px] border-green-700 bg-white rounded-xl shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-blue-700 dark:hover:bg-gray-700">
                            {/* Error Message */}
                            {/* {error && <div className="text-red-600 text-center my-3">{error}</div>} */}

                            {/* Title and Description */}
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                My Profile
                            </h5>

                            {/* Error Display */}
                            <div className="text-red-600 text-center my-3">
                                {/* Conditionally show error messages */}
                            </div>
                            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                                {/* <h1 className="text-3xl font-semibold text-center text-gray-700 mb-8">My Profile</h1> */}
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col items-center mb-6">
                                        <div className="mb-4">
                                            <img
                                                src={userProfile.profilePic || "/default-profile.jpg"}
                                                alt="Profile Image"
                                                width={120}
                                                height={120}
                                                className="rounded-full border-4 border-indigo-600 shadow-lg cursor-pointer"
                                                onClick={handleImageClick} // Make the image clickable
                                            />
                                            <input
                                                ref={imageInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden" // Hide the file input
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-lg font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="text"
                                            value={newPhoneNumber}
                                            onChange={handlePhoneNumberChange}
                                            placeholder="Enter new phone number"
                                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Current phone number: {userProfile.phoneNumber}</p>
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-lg font-medium text-gray-700 mb-2">User ID</label>
                                        <input
                                            type="text"
                                            value={userProfile.userId}
                                            disabled
                                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Your unique user ID: {userProfile.userId}</p>
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-lg font-medium text-gray-700 mb-2">Username</label>
                                        <input
                                            type="text"
                                            value={newUsername}
                                            onChange={handleUsernameChange}
                                            placeholder="Enter new username"
                                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Current username: {userProfile.name}</p>
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-lg font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={userProfile.email}
                                            disabled
                                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Current email: {userProfile.email}</p>
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-lg font-medium text-gray-700 mb-2">Password</label>
                                        <input
                                            type="password"
                                            value={userProfile.password}
                                            disabled
                                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Current password: {userProfile.password}</p>
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-lg font-medium text-gray-700 mb-2">Provider</label>
                                        <input
                                            type="text"
                                            value={userProfile.provider}
                                            disabled
                                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Current provider: {userProfile.provider}</p>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-indigo-600 text-white font-semibold text-lg rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        >
                                            Update Profile
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Profile;
