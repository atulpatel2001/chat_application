'use client'
import React, { useEffect, useState } from "react";
import { Edit, Eye, Trash, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/app/component/Navbar";
import { deleteContactsById, getContacts, getContactsById } from "@/app/services/contact/ContactService";
import { logout } from "@/app/redux/slice/authSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Contact } from "@/app/model/Contact";
import ProfileModal from "@/app/component/ProfileModal";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";


const ContactsPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    useEffect(() => {
        const fetchData = async () => {

            const response = await getContacts();
            if (response?.success) {
                setContacts(response.message);
            } else {
                if (response?.status == 401) {
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
        fetchData();
    }, []);

    const handleEdit = (id: string) => {
        console.log("Edit", id);
        router.push(`/chat/contacts/add_contact/?id=${id}`);
    };

    const handleView = async (id: string) => {
        const response = await getContactsById(id);

        if (response?.success) {
            setSelectedContact(response.message);
            setIsModalOpen(true);
            if (response?.status == 401) {
                dispatch(logout());
                toast.error(response.message, {
                    style: {
                        fontSize: '15px',
                        fontWeight: 'bold',
                        width: '400px',
                    },
                });

                router.push("/chat/login");

            } else {
                toast.error(response?.message, {
                    style: {
                        fontSize: '15px',
                        fontWeight: 'bold',
                        width: '400px',
                    },
                });

            }

        }

    };


    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const handleDelete = async (id: string) => {
        confirmAlert({
            customUI: ({ onClose }) => (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                        <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
                        <p className="text-gray-600 mt-2">Are you sure you want to delete this contact?</p>
                        <div className="flex justify-center space-x-4 mt-4">
                        <button 
                            onClick={() => {
                                toast.info("Deletion canceled", {
                                    position: "top-right",
                                    autoClose: 2000,
                                    style: { fontSize: "14px", fontWeight: "bold" }
                                });
                                onClose();
                            }} 
                            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                            <button 
                                onClick={async () => {
                                    await deleteContact(id);
                                    onClose();
                                }} 
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )
        });
    };


   const deleteContact=async(id:string)=>{
    console.log("Delete", id);
    const response = await deleteContactsById(id);
    if (response?.success) {
        const updatedContacts = contacts.filter(contact => contact.id !== id);
        setContacts(updatedContacts);
        toast.success("Contact deleted successfully!");
    } else {
        if (response?.status == 401) {
            dispatch(logout());
            toast.error(response.message, {
                style: {
                    fontSize: '15px',
                    fontWeight: 'bold',
                    width: '400px',
                },
            });
            router.push("/chat/login");
        } else {
            toast.error("Failed to delete contact.");
        }
    }
    }
    const handleChat = (id: string) => {
        console.log("Chat with", id);
        router.push(`/chat/${id}`);
    };

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
                <h2 className="text-2xl font-semibold mb-6 text-center">Contact List</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-200">
                            <tr className="text-left">
                                <th className="p-3 border">Image</th>
                                <th className="p-3 border">Name</th>
                                <th className="p-3 border">Email</th>
                                <th className="p-3 border">Phone</th>
                                <th className="p-3 border text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((contact) => (
                                <tr key={contact.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 border">
                                        {contact.picture ? (
                                            <Image
                                                src={contact.picture}
                                                alt={contact.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span className="text-gray-500">N/A</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3 border">{contact.name}</td>
                                    <td className="p-3 border">{contact.email}</td>
                                    <td className="p-3 border">{contact.phoneNumber || "N/A"}</td>
                                    <td className="p-3 border flex justify-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(contact.id || '')}
                                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>

                                        <button
                                            onClick={() => handleView(contact.id || '')}
                                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full"
                                            title="View"
                                        >
                                            <Eye size={18} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(contact.id || '')}
                                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                                            title="Delete"
                                        >
                                            <Trash size={18} />
                                        </button>

                                        <button
                                            onClick={() => handleChat(contact.id || '')}
                                            className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full"
                                            title="Chat"
                                        >
                                            <MessageSquare size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
        <ProfileModal contact={selectedContact!} onClose={closeModal} />
      )}
        </>
    );
};

export default ContactsPage;
