'use client'
import Navbar from '@/app/component/Navbar';
import { ChatMessageDto, ChatRoomDto, UserDto } from '@/app/model/ChatRoom';
import { TypingNotification } from '@/app/model/TypingNotification';
import { logout, User } from '@/app/redux/slice/authSlice';
import { getChats, getRooms } from '@/app/services/chat/GroupService';
import StompClientUtil from '@/app/services/chat/WebSocketService';
import { getToken, getUserDetail } from '@/app/services/TokenService';
import { stringToChatDisplayFormate } from '@/app/util/DateFormate';
import { StompHeaders } from '@stomp/stompjs';
import { CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const GroupChat = () => {
  const [newMessage, setNewMessage] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatRoom, setChatRoom] = useState<ChatRoomDto[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedGroup, setSelectedGroup] = useState<ChatRoomDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginUser, setLoginUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  let baseUrl = process.env.NEXT_PUBLIC_BACKEND + "chat-websocket";
  const stompClient = new StompClientUtil(baseUrl);
  const [token, setToken] = useState("");
  // const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [typingMessage, setTypingMessage] = useState<TypingNotification>({
    chatRoomId: "",
    userId: "",
    typing: false,
    userName: ""
  });

  const handleToggleParticipants = () => {
    setShowParticipants(!showParticipants);
  };
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        // Fetch Rooms and Contacts in Parallel
        const [roomsResponse, user, token_] = await Promise.all([getRooms(), getUserDetail(), getToken()]);
        // Handle Rooms Response
        if (roomsResponse?.success) {
          setChatRoom(roomsResponse.message);
        } else if (roomsResponse?.status === 401) {
          handleUnauthorized(roomsResponse.message);
        }
        setLoginUser(user);
        setToken(token_ || "");
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [dispatch, router]);


  // Reusable Function for Unauthorized Handling
  const handleUnauthorized = (message: any) => {
    dispatch(logout());
    toast.error(message, {
      style: {
        fontSize: '15px',
        fontWeight: 'bold',
        width: '400px',
      },
    });
    router.push("/chat/login");
  };




  useEffect(() => {
    if (!selectedGroup?.id) return;

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
          chatRoomId: message.chatRoomId || selectedGroup.id,
          senderId: message.senderId || "",
          receiverId: "",
          message: message.message || "",
          status: message.status || "SENT",
          timestamp: stringToChatDisplayFormate(message.timestamp) || "NOW",
          sender: loginUser?.id === message.senderId ? "You" : "Sender",
          receiverUser: message.senderUser,
          senderUser: message.senderUser,
          seenBy: []

        },
      ]);
    };


    /**
     * call websocket for update status sent to deliver
     * @param message 
     */
    const handleStatusMessageUpdate = (message: any) => {

      if (selectedGroup) {
        if (message) {
          // messages.forEach((msg) => {
          if (message.senderId != loginUser?.id) {
            // setTimeout(() => {
            stompClient.updateMessageStatus(
              "/app/chat.updateStatus_g",
              { chatRoomId: selectedGroup.id, userId: loginUser?.id, status: "DELIVERED" },
              {
                Authorization: "Bearer " + token,
              } as StompHeaders
            );
            // }, 2000);
          }
          // })
        }
      }
    }

    /**
     * this for suscribe for typing
     * @param message 
     */
    const handleTyping_ = (message: any) => {
      console.log("Typing message--->" + message);
      if (loginUser?.id !== message.userId) {
        setTypingMessage(message);
      }
    }


    // const handleUpdatStatus = (message: any) => {
    //   setMessages((prevMessages) => {
    //     // Extract messages with ID (existing messages)
    //     const messagesWithId = message.messageDtoForGroupList;

    //     // Extract messages without ID (temporary messages)
    //     const messagesWithoutId = prevMessages.filter(msg => !msg.id);

    //     // Update messages without ID to include user information
    //     const updatedMessagesWithoutId = messagesWithoutId.map(msg => ({
    //       ...msg,
    //       seenBy: msg.seenBy.map(seen => ({
    //         ...seen,
    //         user: message.userDto, // Ensure message.userDto is defined
    //       })),
    //     }));
    //     console.log(updatedMessagesWithoutId);
    //     return [...messagesWithId, ...updatedMessagesWithoutId];
    //   });

    //   console.log(messages);
    // }


    /**
     * in this method add suscribe method for getmessage and for typing 
     */
    const initializeWebSocket = () => {

      stompClient.connect(
        () => {
          stompClient.subscribeToUserQueue("/topic/public/group/" + selectedGroup.id, (messages) => {
            handleMessage(messages);
            handleStatusMessageUpdate(messages);
            console.log(messages)

          });


          stompClient.subscribeForTyping("/topic/public/typing/group" + selectedGroup.id, (messages) => {
            handleTyping_(messages);
          });

          stompClient.subscribeForTyping("/topic/public/status/update/group/" + selectedGroup.id, (messages) => {
            console.log("Deliverd status ")
            console.log(messages);
            // handleUpdatStatus(messages);

          });


          // stompClient.subscribeForTyping("/topic/public/status/update/sent/" + selectedChat.roomId, (messages) => {
          //   console.log("Read status "+messages)
          //   setMessages((prevMessages) =>
          //     prevMessages.map((msg) => ({
          //       ...msg,
          //       status: 'READ'
          //     }))
          //   );
          // });


        },
        (error) => console.error("WebSocket connection error:", error)
      );
    };

    initializeWebSocket();



    return () => {
      stompClient.disconnect();
    };
  }, [selectedGroup]);


  const setSelectedGroupDetail = useCallback(async (group: ChatRoomDto) => {
    setSelectedGroup(group);

    const [messageResponse] = await Promise.all([getChats(group.id)]);
    if (messageResponse?.success) {
      setMessages(messageResponse.message);
    } else if (messageResponse?.status === 401) {
      handleUnauthorized(messageResponse.message);
    } else {
      toast.error(messageResponse?.message, {
        style: {
          fontSize: '15px',
          fontWeight: 'bold',
          width: '400px',
        },
      });
    }
    setNewMessage("");
  }, [loginUser]);



  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    stompClient.connect(
      () => {
        console.log("Connected to WebSocket");
        stompClient.sendMessage(
          "/app/chat.sendMessage_g",
          {
            chatRoomId: selectedGroup?.id,
            message: newMessage,
            status: "SENT",
            senderId: loginUser?.id,
            timestamp: "",
          },
          {
            Authorization: "Bearer " + token,
          } as StompHeaders
        );
      },
      (error) => console.error("WebSocket connection error:", error)
    );

    setNewMessage("");
  };



  const handleTyping = () => {
    if (newMessage.trim() === "") return;
    if (!typingMessage.typing) {
      stompClient.connect(
        () => {
          console.log("Connected to WebSocket");
          stompClient.isAnyOneIsTyping(
            "/app/chat.sendTyping_g",
            {
              chatRoomId: selectedGroup?.id,
              userId: loginUser?.id,
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
        "/app/chat.sendTyping_g",
        {
          chatRoomId: selectedGroup?.id,
          userId: loginUser?.id,
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
        <div className="w-full h-screen flex bg-gray-100">
          {/* Sidebar for Groups */}
          <div className="w-1/4 h-full bg-white shadow-md p-4 overflow-y-auto">


            <div className="overflow-auto">
              {chatRoom.map((group) => (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroupDetail(group)}
                  className={`p-4 flex items-center space-x-4 cursor-pointer transition duration-300 hover:bg-gray-200 "bg-gray-300" : ""
                  }`}
                // onClick={() => handleChageContact(group.roomId, contact)}
                >
                  {group && (
                    <img
                      src={group.groupImage || "http://res.cloudinary.com/dnhniwrqh/image/upload/c_fill,h_500,w_500/9cfcf9d1-0438-4d81-988b-b49590dcc249"}
                      alt={group.name || "Group"}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{group.name}</p>
                    {/* <p className="text-sm text-gray-500 truncate">{group.name}</p> */}
                  </div>
                  {/* <p className="text-xs text-gray-400">12:10pm</p> */}
                </div>
              ))}
            </div>
          </div>
          {/* Chat Section */}
          {selectedGroup ? (
            <div className="flex-1 h-full flex flex-col justify-between bg-white shadow-xl rounded-2xl m-4 p-5" >
              {/* Group Info Section */}
              <div
                className="flex justify-between items-center mb-4  cursor-pointer hover:bg-gray-200 " style={{ padding: "10px", borderRadius: "7px" }}
                onClick={handleToggleParticipants}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                    <img src={selectedGroup.groupImage} alt={selectedGroup.name} className="h-full w-full object-cover" />
                  </div>
                  <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
                </div>
                <button className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300">
                  Members
                </button>
              </div>
              {/* Messages Section */}
              <div className="flex-1 mb-4 overflow-y-auto">
                {messages ? (messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-center mb-3 ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`mr-3 h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${msg.sender === "You" ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      <img
                        src={msg.senderUser.profilePic || ""}
                        alt={msg.senderUser.name}
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div
                      className={`relative p-3 rounded-2xl shadow-md ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-blue-100"} hover:opacity-90`}
                    >
                      {/* Message Text */}
                      <div>
                        {msg.message}
                        <span className="ml-2 text-xs opacity-75">{msg.timestamp}</span>

                        {/* Display Sender's Name on Hover */}
                        {msg.sender !== "You" && (
                          <span className="absolute left-0 top-[-20px] text-sm font-semibold text-gray-700 opacity-0 hover:opacity-100 transition-opacity duration-200">
                            {msg.senderUser.name}
                          </span>
                        )}

                        {msg.sender === "You" && (
                          <>
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
                  </div>


                ))
                ) : (
                  <div className="flex-1 h-full flex flex-col justify-between bg-white shadow-xl rounded-2xl m-4 p-4">
                    <p className="font-semibold">No messages yet</p>
                  </div>)
                }
              </div>

              {/* Send Message Input Section */}
              {typingMessage.typing && <span className='ml-2 text-sm opacity-90 bg-white text-green-500' style={{ fontWeight: 'bold' }}>{typingMessage.userName} is typing</span>}
              <div className="flex items-center mt-2">

                <input
                  type="text"
                  className="flex-1 mr-3 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition duration-300"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>

              {/* Participants Detail Slide */}
              {showParticipants && (
                <div
                  className="fixed top-0 left-0 right-0 bottom-0 bg-white p-6 overflow-y-auto transition-transform transform duration-300 ease-in-out"
                  style={{ transform: showParticipants ? 'translateY(0)' : 'translateY(-100%)' }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Participants</h3>
                    <button
                      className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
                      onClick={() => setShowParticipants(false)}
                    >
                      Close
                    </button>
                  </div>
                  <div>
                    {selectedGroup.participants.map((participant, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <div className="mr-3 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                          {participant.user.name}
                        </div>
                        {/* <p>{participant}</p> */}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 h-full flex flex-col justify-between bg-white shadow-xl rounded-2xl m-4 p-4">
              <p className="font-semibold">Select Group For Chat</p>
            </div>
          )}

          {showParticipants && selectedGroup && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              {/* Wider Modal Container */}
              <div className="bg-white p-8 rounded-xl w-[700px] h-[50vh] max-h-[90vh] overflow-y-auto">
                {/* Group Info Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={selectedGroup.groupImage}
                        alt={selectedGroup.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">{selectedGroup.name}</h3>
                      {/* Optionally display the group description if needed */}
                      {/* <p className="text-sm text-gray-500">{selectedGroup.description}</p> */}
                    </div>
                  </div>
                </div>

                {/* Participants Section */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-3">Members</h4>
                  <div>
                    {selectedGroup.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center mb-5">
                        <div className="mr-4 h-12 w-12 rounded-full bg-gray-300 overflow-hidden">
                          <img
                            src={participant.user.profilePic || ""}
                            alt={participant.user.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-xl">{participant.user.name}</p>
                          <p className="text-sm text-gray-500">{participant.user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end mt-6">
                  <button
                    className="bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300"
                    onClick={handleToggleParticipants}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>

    </>
  );
};

export default GroupChat;
