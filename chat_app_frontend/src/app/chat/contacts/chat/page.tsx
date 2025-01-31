"use client";
import { useEffect, useState } from "react";
import {
  UserCircleIcon,
  PhoneIcon,
  VideoCameraIcon,
  PaperClipIcon,
  FaceSmileIcon,
  MicrophoneIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { ChatDisplayDto } from "@/app/model/ChatDisplayDto";
import { getChatsForDisplay } from "@/app/services/chat/ChatService";
import { useDispatch } from "react-redux";
import { logout } from "@/app/redux/slice/authSlice";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/app/component/Navbar";
import { getContactsById } from "@/app/services/contact/ContactService";
import { Contact } from "@/app/model/Contact";

// const contacts = [
//   {
//     id: 1,
//     name: "John Doe",
//     lastMessage: "Hey, how are you?",
//     time: "10:30 AM",
//     profilePic: "https://via.placeholder.com/50",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     lastMessage: "Let's catch up!",
//     time: "Yesterday",
//     profilePic: "https://via.placeholder.com/50",
//   },
// ];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<ChatDisplayDto>({
    roomId: "",
    lastMessage: "",
    lastMessageTime: "",
    name: "",
    profilePic: ""

  });

  const [messages, setMessages] = useState([
    { sender: "You", text: "Hey!", timestamp: "10:15 AM", seen: true },
    { sender: "John Doe", text: "Hey, how are you?", timestamp: "10:30 AM", seen: false },
  ]);
  const [input, setInput] = useState("");
  const [displayData, setDisplayData] = useState<ChatDisplayDto[]>([
    {
      lastMessage: "Hey, how are you?",
      lastMessageTime: "12:10 pm",
      name: "John Doe",
      profilePic: "http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249",
      roomId: "1"
    },
    {
      lastMessage: "Hey, how are you?",
      lastMessageTime: "12:10 pm",
      name: "John Doe",
      profilePic: "http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249",
      roomId: "2"
    },
    {
      lastMessage: "Hey, how are you?",
      lastMessageTime: "12:10 pm",
      name: "John Doe",
      profilePic: "http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249",
      roomId: "3"
    },
    {
      lastMessage: "Hey, how are you?",
      lastMessageTime: "12:10 pm",
      name: "John Doe",
      profilePic: "http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249",
      roomId: "4"
    }
  ]);
  const dispatch = useDispatch()
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  useEffect(() => {
    const fetchData = async () => {

      const response = await getChatsForDisplay(id);
      if (response?.success) {
        console.log(response.message);
        // setContacts(response.message);
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
    const getContactData = async () => {
      const response = await getContactsById(id);

      if (response?.success) {

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
          toast.error(response?.message, {
            style: {
              fontSize: '15px',
              fontWeight: 'bold',
              width: '400px',
            },
          });

        }

      }
    }

    fetchData();
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "You", text: input, timestamp: "Now", seen: false }]);
    setInput("");
  };

  return (
    <>
      <Navbar />
      <div className=" flex h-screen bg-gray-200" style={{ marginLeft: "80px", marginRight: "80px" }}>
        {/* Left Sidebar - Contact List */}
        <div className="w-1/4 border-r bg-gray-100 shadow-lg">
          <div className="p-4 flex justify-between items-center border-b bg-gray-50">
            <h1 className="text-lg font-semibold">Chats</h1>
            <UserCircleIcon className="w-8 h-8 text-gray-500 cursor-pointer" />
          </div>
          <div className="overflow-auto">
            {displayData.map((contact) => (
              <div
                key={contact.roomId}
                className={`p-4 flex items-center space-x-4 cursor-pointer transition duration-300 hover:bg-gray-200 ${selectedChat.roomId === contact.roomId ? "bg-gray-300" : ""
                  }`}
                onClick={() => setSelectedChat(contact)}
              >
                <img src={contact.profilePic} alt={contact.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                </div>
                <p className="text-xs text-gray-400">{contact.lastMessageTime}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="p-4 bg-gray-100 flex justify-between items-center border-b shadow-md">
            <div className="flex items-center space-x-4">
              <img src={selectedChat.profilePic} alt={selectedChat.name} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">{selectedChat.name}</p>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <PhoneIcon className="w-6 h-6 text-gray-500 cursor-pointer hover:text-blue-500" />
              <VideoCameraIcon className="w-6 h-6 text-gray-500 cursor-pointer hover:text-blue-500" />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 ${msg.sender === "You" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block px-4 py-2 rounded-lg shadow-md ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                    }`}
                >
                  {msg.text} <span className="ml-2 text-xs opacity-75">{msg.timestamp}</span>
                  {msg.sender === "You" && (
                    <CheckIcon className={`w-4 h-4 inline ml-2 ${msg.seen ? "text-green-500" : "text-gray-400"}`} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 flex items-center bg-gray-100 border-t shadow-md">
            <FaceSmileIcon className="w-6 h-6 text-gray-500 cursor-pointer" />
            <input
              type="text"
              className="flex-1 p-2 mx-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <PaperClipIcon className="w-6 h-6 text-gray-500 cursor-pointer" />
            <MicrophoneIcon className="w-6 h-6 text-gray-500 cursor-pointer" />
            <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
