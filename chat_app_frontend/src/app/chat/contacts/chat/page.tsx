"use client";
import { useEffect, useRef, useState } from "react";
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
import { getChatsForDisplay, getMessageByGroupId } from "@/app/services/chat/ChatService";
import { useDispatch } from "react-redux";
import { logout, User } from "@/app/redux/slice/authSlice";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/app/component/Navbar";
import { getContactsById } from "@/app/services/contact/ContactService";
import { ChatMessageDto } from "@/app/model/Message";
import StompClientUtil from "@/app/services/chat/WebSocketService";
import { IMessage, StompHeaders } from "@stomp/stompjs";
import { getToken, getUserDetail } from "@/app/services/TokenService";
import { stringToChatDisplayFormate } from "@/app/util/DateFormate";


export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<ChatDisplayDto>({
    roomId: "",
    lastMessage: "",
    lastMessageTime: "",
    name: "",
    profilePic: "",
    userId: ""

  });

  const [user, setUser] = useState<User>({
    id: "",
    email: "",
  })

  const [token, setToken] = useState("");
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [input, setInput] = useState("");
  const [displayData, setDisplayData] = useState<ChatDisplayDto[]>([]);
  const dispatch = useDispatch()
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 'no';
  let baseUrl = "http://localhost:8081/chat-websocket";

  const stompClient = new StompClientUtil(baseUrl);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  // const stompClientRef = useRef(new StompClientUtil(baseUrl));

  // const data = localStorage.getItem("Chat_User");
  // const user2: User = JSON.parse(data || "");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
   
    const fetchData = async () => {
      try {
        const response = await getChatsForDisplay(id);
        if (response?.success) {
          console.log(response.message);
          setDisplayData(response.message.chatDisplayDtos);
          setSelectedChat(response.message.singleEmployee);
          setMessages(response.message.chatMessageDtos);
        } else if (response?.status === 401) {
          handleUnauthorized(response.message);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    // const getContactData = async () => {
    //   try {
    //     const response = await getContactsById(id);
    //     if (!response?.success && response?.status === 401) {
    //       handleUnauthorized(response.message);
    //     } else if (!response?.success) {
    //       toastError(response?.message);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching contact data:", error);
    //   }
    // };

    const handleUnauthorized = (message: string) => {
      dispatch(logout());
      toastError(message);
      router.push("/chat/login");
    };

    const toastError = (message: string) => {
      toast.error(message, {
        style: { fontSize: "15px", fontWeight: "bold", width: "400px" },
      });
    };
    const getUserData = async () => {
      let user2: User = await getUserDetail();
      setUser(user2);
    }

    const getTokenByUser = async () => {
      const token = await getToken();
      setToken(token || "");
    }


    const initialize = async () => {
      await getUserData();
      await getTokenByUser();
      await Promise.all([fetchData()]);
    };

    initialize();
  }, [id]);


  useEffect(() => {
    if (!selectedChat?.roomId) return;

    /**
     * handle message form websocket
     * @param message 
     */
    const handleMessage = (message: any) => {
      console.log("message--->" + message);

      console.log(message.chatRoomId)
      setMessages((prev) => [
        ...prev,
        {
          id: message.id || "",
          chatRoomId: message.chatRoomId || selectedChat.roomId,
          senderId: message.senderId || "",
          receiverId: message.receiverId || selectedChat.userId,
          message: message.message || "",
          status: message.status || "SENT",
          timestamp: stringToChatDisplayFormate(message.timestamp) || "NOW",
          sender: user.id === message.senderId ? "You" : "Sender",
        },
      ]);
    };


    /**
     * call websocket for update status sent to deliver
     * @param message 
     */
    const handleStatusMessageUpdate = (message: any) => {
      if (message.receiverId === user.id) {
        setTimeout(() => {
          stompClient.updateMessageStatus(
            "/app/chat.updateStatus",
            { chatRoomId: selectedChat.roomId, userId: user.id, status: "DELIVERED" },
            {
              Authorization: "Bearer " + token,
            } as StompHeaders
          );
        }, 2000);
      }
    }

    /**
     * this for suscribe for typing
     * @param message 
     */
    const handleTyping_ = (message: any) => {
      console.log("Typing message--->" + message);
      if (user.id !== message.userId) {
        setIsTyping(message.typing);
      }
    }

    /**
     * in this method add suscribe method for getmessage and for typing 
     */
    const initializeWebSocket = () => {

      stompClient.connect(
        () => {
          stompClient.subscribeToUserQueue("/topic/public/" + selectedChat.roomId, (messages) => {
            handleMessage(messages);
            handleStatusMessageUpdate(messages);


          });


          stompClient.subscribeForTyping("/topic/public/typing/" + selectedChat.roomId, (messages) => {
            handleTyping_(messages);
          });

          stompClient.subscribeForTyping("/topic/public/status/update/" + selectedChat.roomId, (messages) => {
            console.log("Deliverd status "+messages)
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.status != 'READ' ? { ...msg, status: 'DELIVERED' } : msg
              )
            );
          });


          stompClient.subscribeForTyping("/topic/public/status/update/sent/" + selectedChat.roomId, (messages) => {
            console.log("Read status "+messages)
            setMessages((prevMessages) =>
              prevMessages.map((msg) => ({
                ...msg,
                status: 'READ'
              }))
            );
          });
    

        },
        (error) => console.error("WebSocket connection error:", error)
      );
    };

    initializeWebSocket();



    return () => {
      stompClient.disconnect();
    };
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      messages.forEach((msg) => {
        if (msg.receiverId === user.id && msg.status !== "READ") {
        
          stompClient.connect(
            () => {
              setTimeout(() => {
                stompClient.updateMessageStatus(
                  "/app/chat.updateStatus.Read",
                  { chatRoomId: selectedChat.roomId, userId: user.id, status: "READ" },
                  {
                    Authorization: "Bearer " + token,
                  } as StompHeaders
                );
              }, 5000);
            },
            (error) => console.error("WebSocket connection error:", error)
          );
        }
      });
    }
  }, [selectedChat]);


  const handleScroll = () => {
    if (chatContainerRef.current) {
      console.log("out1")
      const isAtBottom = chatContainerRef.current.scrollHeight - chatContainerRef.current.scrollTop === chatContainerRef.current.clientHeight;
      if (isAtBottom && selectedChat) {
        console.log("out")
        messages.forEach((msg) => {
          console.log(msg.receiverId);

          if (msg.receiverId === user.id && msg.status !== "READ") {
            console.log("in")
            stompClient.connect(
              () => {
                setTimeout(() => {
                  stompClient.updateMessageStatus(
                    "/app/chat.updateStatus.Read",
                    { chatRoomId: selectedChat.roomId, userId: user.id, status: "READ" },
                    {
                      Authorization: "Bearer " + token,
                    }
                  );
                }, 5000);
              },
              (error) => console.error("WebSocket connection error:", error)
            );
          }
        });
      }
    }
  };

  useEffect(() => {
    const currentContainer = chatContainerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [messages, selectedChat]);


  const sendMessage = () => {
    if (input.trim() === "") return;
    stompClient.connect(
      () => {
        console.log("Connected to WebSocket");
        stompClient.sendMessage(
          "/app/chat.sendMessage",
          {
            chatRoomId: selectedChat.roomId,
            receiverId: selectedChat.userId,
            message: input,
            status: "SENT",
            senderId: user.id,
            timestamp: "",
          },
          {
            Authorization: "Bearer " + token,
          } as StompHeaders
        );
      },
      (error) => console.error("WebSocket connection error:", error)
    );

    setInput("");
  };


  const handleChageContact = async (roomId: string, contact: ChatDisplayDto) => {
    const response = await getMessageByGroupId(roomId);
    if (response?.success) {
      console.log(response.message);
      setSelectedChat(contact);
      setIsTyping(false);
      setInput("");
      setMessages(response.message);
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


  const handleTyping = () => {
    if (input.trim() === "") return;
    if (!isTyping) {
      stompClient.connect(
        () => {
          console.log("Connected to WebSocket");
          stompClient.isAnyOneIsTyping(
            "/app/chat.sendTyping",
            {
              chatRoomId: selectedChat.roomId,
              userId: user.id,
              typing: true,
            },
            {
              Authorization: "Bearer " + token,
            } as StompHeaders
          );
        },
        (error) => console.error("WebSocket connection error:", error)
      );
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }



    typingTimeout.current = setTimeout(() => {
      console.log("time out")
      stompClient.isAnyOneIsTyping(
        "/app/chat.sendTyping",
        {
          chatRoomId: selectedChat.roomId,
          userId: user.id,
          typing: false,
        },
        {
          Authorization: "Bearer " + token,
        } as StompHeaders
      );
    }, 5000);
    return () => {
      stompClient.disconnect();
    };
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
                onClick={() => handleChageContact(contact.roomId, contact)}
              >
                {contact && (
                  <img
                    src={contact.profilePic || "http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249"}
                    alt={contact.name || "User"}
                    className="w-10 h-10 rounded-full"
                  />
                )}
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
              {selectedChat && (
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedChat.profilePic || "http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249"}
                    alt={selectedChat.name || "User"}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{selectedChat.name}</p>
                    <p className="text-sm text-green-500">Online</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <PhoneIcon className="w-6 h-6 text-gray-500 cursor-pointer hover:text-blue-500" />
              <VideoCameraIcon className="w-6 h-6 text-gray-500 cursor-pointer hover:text-blue-500" />
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={chatContainerRef} className="flex-1 overflow-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 ${msg.sender === "You" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block px-4 py-2 rounded-lg shadow-md ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                    }`}
                >
                  {msg.message} <span className="ml-2 text-xs opacity-75">{msg.timestamp}</span>
                  {msg.sender === "You" && (
                    <>
                      {/* <p>{msg.status}</p> */}
                      {msg.status === "SENT" && (
                        <CheckIcon className="w-4 h-4 inline ml-2 text-gray-400" />
                      )}

                      {msg.status === "DELIVERED" && (
                        <>
                          <CheckIcon className="w-4 h-4 inline ml-2 text-gray-400" />
                          <CheckIcon className="w-4 h-4 inline -ml-2 text-gray-400" />
                        </>
                      )}

                      {msg.status === "READ" && (
                        <>
                          <CheckIcon className="w-4 h-4 inline ml-2 text-green-500" />
                          <CheckIcon className="w-4 h-4 inline -ml-2 text-green-500" />
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          {isTyping && (<p className="ml-3 text-green-500" style={{ fontWeight: 'bold' }}>Typing</p>)}
          <div className="p-4 flex items-center bg-gray-100 border-t shadow-md">

            <FaceSmileIcon className="w-6 h-6 text-gray-500 cursor-pointer" />
            <input
              type="text"
              className="flex-1 p-2 mx-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                handleTyping();
              }}
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
