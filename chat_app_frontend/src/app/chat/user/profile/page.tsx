'use client';
import Navbar from "@/app/component/Navbar";
import { UserModel } from "@/app/model/UserModel";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { logout, User } from '@/app/redux/slice/authSlice';
import { updateUser, userInfo } from "@/app/services/user/UserService";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";



interface ValidationError {
    [key: string]: string;
}

const Profile: React.FC = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    // const { isLoggedIn, user, token } = useSelector((state: RootState) => state.auth);

    // Set initial state for the profile
    const [userProfile, setUserProfile] = useState<UserModel>({
        profilePic: "/logo.png",
        phoneNumber: "1234567890",
        password: "********",
        name: "John Doe",
        email: "test@example.com",
        provider: "google",
        userId: "151565nhbfhbfd",
        userImage: null
    });
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const [newImage, setNewImage] = useState<File | null>(null);
    const [newPhoneNumber, setNewPhoneNumber] = useState<string>(userProfile.phoneNumber);
    const [newUsername, setNewUsername] = useState<string>(userProfile.name);
    const [errors, setErrors] = useState<ValidationError>({});
    const [isHidden, setIsHidden] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {

            const token = localStorage.getItem("Chat_Auth_Token");
            const storedUser = localStorage.getItem("Chat_User");
            if (token && storedUser) {
                const user: User = JSON.parse(storedUser);
                const response = await userInfo(user.id);

                if (response != undefined) {
                    if (response.success == true) {
                        setUserProfile(response.data);
                        setNewPhoneNumber(response.data.phoneNumber != null ? response.data.phoneNumber : '');
                        setNewUsername(response.data.name != null ? response.data.name : '');
                        // setUserProfile((prevProfile) => ({
                        //     ...prevProfile,
                        //     userId:"cdnjkcnbdmjcdcd",
                        // }))

                    }else{
                        if(response.status == 401){

                            dispatch(logout());
                            toast.error(response.message, {
                                style: {
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    width: '400px',
                                },
                            });
                            router.push("/chat/login");
                        }
                    }
                }

            } else {
                dispatch(logout());
                router.push('/chat/login');
            }

        };

        fetchUserProfile();
    }, []);

    // Handle image change
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
            setUserProfile((prevProfile) => ({
                ...prevProfile,
                userImage: file,
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
        const responseData = await updateUser(updatedProfile);

        if (responseData?.success) {
            toast.success(responseData.message);
        } else {
            if (responseData?.field) {
                setErrors(responseData.message);
            } else {
                if(responseData?.status == 401){
                    dispatch(logout());
                        toast.error(responseData.message, {
                            style: {
                                fontSize: '15px',
                                fontWeight: 'bold',
                                width: '400px',
                            },
                        });
                        
                        router.push("/chat/login");
                   
                }else{
                toast.error(responseData?.message, {
                    style: {
                        fontSize: '15px',
                        fontWeight: 'bold',
                        width: '400px',
                    },
                });

            }
            }
        }

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

                                            {errors.userImage && <p className="mt-1 text-sm text-red-600 font-bold">{errors.userImage}</p>}
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
                                        {errors.phoneNumber && <p className="mt-1 text-sm text-red-600 font-bold">{errors.phoneNumber}</p>}
                                    </div>
                                    {!isHidden && (
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

                                    )}

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
                                        {errors.name && <p className="mt-1 text-sm text-red-600 font-bold">{errors.name}</p>}
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
                                        {errors.email && <p className="mt-1 text-sm text-red-600 font-bold">{errors.email}</p>}
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
                                        {errors.password && <p className="mt-1 text-sm text-red-600 font-bold">{errors.password}</p>}
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
