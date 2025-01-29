'use client';

import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Contact } from '@/app/model/Contact';
import { addContact } from '@/app/services/contact/ContactService';
import { logout, User } from '@/app/redux/slice/authSlice';
import { useDispatch } from "react-redux";
interface ContactFormProps {
    contactId?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ contactId }) => {

    const user = localStorage.getItem("Chat_User");
    const user2: User = JSON.parse(user || "");
    const [formData, setFormData] = useState<Contact>({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        picture: '',
        description: '',
        favorite: false,
        userId: user2.id,
        links: [],
        contact_image: null
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [newImage, setNewImage] = useState<File | null>(null);

    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const router = useRouter();
    const dispatch = useDispatch();
    useEffect(() => {
        if (contactId) {

            fetch(`/api/contacts/${contactId}`)
                .then((response) => response.json())
                .then((data) => setFormData(data))
                .catch(() => toast.error('Failed to load contact data.'));
        }
    }, [contactId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log(formData)

        const responseData = await addContact(formData);
        console.log(responseData)
        if (responseData?.success) {
            toast.success(responseData.message);
        } else {
            if (responseData?.field) {
                setErrors(responseData.message);
            } else {
                if (responseData?.status == 401) {
                    dispatch(logout());
                    toast.error(responseData.message, {
                        style: {
                            fontSize: '15px',
                            fontWeight: 'bold',
                            width: '400px',
                        },
                    });

                    router.push("/chat/login");

                } else {
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
        // const method = contactId ? 'PUT' : 'POST';
        // const url = contactId ? `/api/contacts/${contactId}` : '/api/contacts';

        // const response = await fetch(url, {
        //     method,
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formData),
        // });

        // if (response.ok) {
        //     toast.success(`Contact ${contactId ? 'updated' : 'created'} successfully.`);
        //     router.push('/contacts');
        // } else {
        //     const result = await response.json();
        //     if (result.errors) {
        //         setErrors(result.errors);
        //     } else {
        //         toast.error('Operation failed.');
        //     }
        // }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            email: '',
            phoneNumber: '',
            address: '',
            picture: '',
            description: '',
            favorite: false,
            userId: '',
            links: [],
            contact_image: null
        });
        setErrors({});
    };


    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
            setFormData((prevProfile) => ({
                ...prevProfile,
                contact_image: file,
                picture: URL.createObjectURL(file),
            }));
        }
    };


    const addLink = () => {
        setFormData({
            ...formData,
            links: [...(formData.links ?? []), { title: '', link: '' }],
        });
    };

    const handleLinkChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { id, value } = e.target;
        const updatedLinks = formData.links?.map((link: { title: string; link: string }, i: number) =>
            i === index ? { ...link, [id.split('-')[0]]: value } : link
        );
        setFormData({ ...formData, links: updatedLinks });
    };

    const removeLink = (index: number) => {
        const updatedLinks = formData.links?.filter((_, i: number) => i !== index);
        setFormData({ ...formData, links: updatedLinks });
    };

    const handleChangeCheckBox = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, type, value } = e.target;

        if (type === 'checkbox') {
            const input = e.target as HTMLInputElement; // Type assertion
            setFormData({ ...formData, [id]: input.checked });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleImageClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    };

    return (
        <div className="flex justify-center mt-8 mb-8">
            <div className="w-full max-w-3xl p-6 border-t-4 border-blue-700 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-blue-700">
                <h5 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                    {contactId ? 'Edit Contact' : 'Add Contact'}
                </h5>
                <form onSubmit={handleSubmit} noValidate>


                    <div className="flex flex-col items-center mb-6">
                        <div className="mb-4">
                            <img
                                src={formData.picture || "/user_img3.png"}
                                alt="Profile Image"
                                width={120}
                                height={120}
                                className="rounded-full border-4 border-indigo-600 shadow-lg cursor-pointer"
                                onClick={handleImageClick}
                            />
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {errors.userImage && <p className="mt-1 text-sm text-red-600 font-bold">{errors.userImage}</p>}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter name"
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 font-bold">{errors.name}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="name@example.com"
                            required
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600 font-bold">{errors.email}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="phoneNumber"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter phone number"
                        />
                        {errors.phoneNumber && (
                            <p className="mt-1 text-sm text-red-600 font-bold" >{errors.phoneNumber}</p>
                        )}
                    </div>


                    <div className="mb-4">
                        <label htmlFor="favorite" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Favorite
                        </label>
                        <input
                            type="checkbox"
                            id="favorite"
                            checked={formData.favorite}
                            onChange={handleChangeCheckBox}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Social Links
                        </label>
                        {formData.links?.map((link: any, index: number) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    id={`title-${index}`}
                                    value={link.title}
                                    onChange={(e) => handleLinkChange(e, index)}
                                    placeholder="Platform"
                                    className="w-1/3 p-2.5 mr-2 bg-gray-50 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                                <input
                                    type="url"
                                    id={`link-${index}`}
                                    value={link.link}
                                    onChange={(e) => handleLinkChange(e, index)}
                                    placeholder="URL"
                                    className="w-2/3 p-2.5 bg-gray-50 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                                {errors.link && (
                                    <p className="mt-1 text-sm text-red-600 font-bold">{errors.link}</p>)}
                                <button
                                    type="button"
                                    onClick={() => removeLink(index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addLink}
                            className="px-4 py-2 mt-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                            Add Link
                        </button>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="address"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Address
                        </label>
                        <textarea
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter address"
                        />
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-600 font-bold">{errors.address}</p>
                        )}
                    </div>


                    <div className="mb-4">
                        <label
                            htmlFor="description"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter Discription" />

                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600 font-bold">{errors.description}</p>
                        )}
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold text-lg rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            Add Contact
                        </button>
                    </div>
                </form>

            </div>
        </div>


    )
};

export default ContactForm;