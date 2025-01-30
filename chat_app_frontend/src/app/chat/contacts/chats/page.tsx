// components/ChatList.tsx
import React from 'react';
import Image from 'next/image';
import Navbar from '@/app/component/Navbar';

interface Chat {
    id: string;
    name: string;
    message: string;
    time: string;
    imageUrl?: string;
    unread?: boolean;
    group?: boolean;
}
const chats: Chat[] = [
    {
        id: '1',
        name: '+91 93550 03892',
        message: 'Hello! Your loan eligibility...',
        time: '12:56 pm',
        imageUrl: 'http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249',
    },
    {
        id: '2',
        name: '+91 89569 90047',
        message: 'Card Update! Your Bajaj Finserv...',
        time: '12:31 pm',
        imageUrl: 'http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249',
        unread: true,
    },
    {
        id: '3',
        name: 'યુવા એકતા ગ્રુપ ભંડવાલ',
        message: 'Sidharth: Video',
        time: '11:45 am',
        imageUrl: 'http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249',
        group: true,
        unread: true,
    },
    {
        id: '4',
        name: 'Papa',
        message: '/ જય શ્રીરામ',
        time: '10:26 am',
        imageUrl: 'http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249',
    },
    {
        id: '5',
        name: 'ન્યુ ભંડવાલ ગ્રુપ',
        message: '~jdspatel149: Photo',
        time: '9:03 am',
        imageUrl: 'http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249',
        group: true,
    },
    {
        id: '6',
        name: 'Bebo',
        message: 'You reacted to: "Jay shree krishna"',
        time: '8:23 am',
        imageUrl: 'http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249',
    },
    {
        id: '7',
        name: 'ભંડવાલ ગ્રામ પંચાયત',
        message: '~yogesh Patel: Dispatch_04765711.pdf 3 pages',
        time: '8:01 am',
        imageUrl: 'http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249',
        group: true,
        unread: true,
    },
    {
        id: '8',
        name: '+91 82384 62537',
        message: '✓✓ Location',
        time: 'Yesterday',
        imageUrl: 'http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249',
    },
    {
        id: '9',
        name: 'Atul Kumar. Jasu. Bhai Patel (You)',
        message: '✓✓✓✓✓ 82384 62537',
        time: 'Yesterday',
        imageUrl: 'http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249',
    },
];

const ChatList: React.FC = () => {
  
    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto p-6  min-h-screen">
                <h2 className="text-2xl font-semibold mb-6 text-center">About Us</h2>
                <div className="overflow-hidden">
                    <div className="chat-list overflow-y-auto max-h-[1000px]">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                className="chat flex items-center p-4 border-b border-gray-200 cursor-pointer relative hover:bg-gray-100 transition duration-300 ease-in-out"
                            >
                                {chat.imageUrl && (
                                    <div className="relative w-12 h-12 mr-4">
                                        <Image
                                            src={chat.imageUrl}
                                            alt={chat.name}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-full shadow-lg"
                                        />
                                    </div>
                                )}
                                <div className="chat-info flex-grow">
                                    <span className="name font-semibold text-gray-800 block">{chat.name}</span>
                                    <span className="message text-gray-600 text-sm line-clamp-1">
                                        {chat.message}
                                    </span>
                                </div>
                                <div className="chat-time flex items-center ml-auto">
                                    <span className="time text-gray-500 text-xs">{chat.time}</span>
                                    {chat.unread && (
                                        <span className="unread-badge ml-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                                            1
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatList;
