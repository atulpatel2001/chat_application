'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus, UserPlus, UserMinus, Edit2, Trash, Save } from 'lucide-react';
import Navbar from '@/app/component/Navbar';
import { Contact } from '@/app/model/Contact';
import { getContacts } from '@/app/services/contact/ContactService';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout, User } from '@/app/redux/slice/authSlice';
import { toast } from 'react-toastify';
import { ChatParticipantDto, ChatRoomDto } from '@/app/model/ChatRoom';
import { addParticipant_, create, getRooms, updateGroupDetailData } from '@/app/services/chat/GroupService';
import { getUserDetail } from '@/app/services/TokenService';

export default function CreateGroup() {

  const [contacts, setContacts] = useState<Contact[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermForGroup, setSearchTermForGroup] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;
  const [selectedGroup, setSelectedGroup] = useState<ChatRoomDto | null>(null);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [isEditButtonShow, setIsEditButtonShow] = useState(false);
  const [showParticipantSelector, setShowParticipantSelector] = useState(false);
  const [newGroupImage, setNewGroupImage] = useState<File | null>(null);
  const [updateGroupImage, setpUdateGroupImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [updateImagePreview, setUpdateImagePreview] = useState<string>(selectedGroup?.groupImage || "");
  const fileImageRef = useRef<HTMLInputElement | null>(null);
  const [updateGroupName_, setUpdateGroupName] = useState(selectedGroup?.name || "");
  const [chatRoom, setChatRoom] = useState<ChatRoomDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loginUser, setLoginUser] = useState<User | null>(null);
  const [permission, setPermission] = useState(false);


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        // Fetch Rooms and Contacts in Parallel
        const [roomsResponse, contactsResponse, user] = await Promise.all([getRooms(), getContacts(), getUserDetail()]);
        // Handle Rooms Response
        if (roomsResponse?.success) {
          setChatRoom(roomsResponse.message);
        } else if (roomsResponse?.status === 401) {
          handleUnauthorized(roomsResponse.message);
        }

        // Handle Contacts Response
        if (contactsResponse?.success) {
          setContacts(contactsResponse.message);
        } else if (contactsResponse?.status === 401) {
          //handleUnauthorized(contactsResponse.message);
        }
        setLoginUser(user);

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

  // Set Selected Group Details
  const setSelectedGroupDetail = useCallback((group: ChatRoomDto) => {
    setSelectedGroup(group);
    setUpdateGroupName(group.name);
    setUpdateImagePreview(group.groupImage);
    setIsEditButtonShow(false);
    setImagePreview("");
    setIsEditingGroup(false);
  
    const participant:any  = group?.participants?.find(
      (p) => p?.user?.id === loginUser?.id
    );
    setPermission(participant?.admin);
  }, [loginUser]);

  // Memoize Filtered Users
  const allFilteredUsers = useMemo(() =>
    contacts.filter(
      (user) =>
        selectedGroup?.participants &&
        !selectedGroup.participants.find((p) => p.id === user.id) &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [contacts, searchTerm, selectedGroup?.participants]
  );

  // Paginate Filtered Users
  const paginatedUsers = useMemo(() =>
    allFilteredUsers.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
    ), [allFilteredUsers, currentPage, usersPerPage]
  );

  const totalPages = Math.ceil(allFilteredUsers.length / usersPerPage);


  // Handle Page Change
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Reset to First Page on Search Change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle Image Change
  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewGroupImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  // Create Group Function
  const createGroup = async () => {
    if (!newGroupName.trim()) return;
    setIsLoading(true);

    const newGroup: ChatRoomDto = {
      id: Date.now().toString(),
      name: newGroupName,
      image: newGroupImage,
      participants: [],
      groupImage: "",
      type: ""
    };

    let response = await create(newGroup);

    if (response?.success) {
      setNewGroupName("");
      setNewGroupImage(null);
      setImagePreview("");

      // Append to chatRoom list
      setChatRoom((prevChatRooms) => [
        ...prevChatRooms,
        ...(Array.isArray(response.message) ? response.message : [response.message])
      ]);

      setIsCreateGroupOpen(false);

      toast.success("Successfully Created Group");
    } else if (response?.status === 401) {
      handleUnauthorized(response.message);
    } else {
      toast.error(response?.message, {
        style: {
          fontSize: '15px',
          fontWeight: 'bold',
          width: '400px',
        },
      });
    }
    setIsLoading(false);
  };

  /**
   * 
   * update groupname in state
   */
  const updateGroupName = (newName: string) => {
    console.log(newName + "----->" + updateGroupName_);
    setUpdateGroupName(newName);
    if (newName.trim() != "" && newName.trim() != selectedGroup?.name) {

      setIsEditButtonShow(true);
    } else {
      setIsEditButtonShow(false);
    }
  };
  /**
   * 
   * update group image in currentstate with file and image preview 
   */
  const updateGroupImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // setGroupImage(file);
      setUpdateImagePreview(URL.createObjectURL(file));
      setpUdateGroupImage(file);
      setIsEditButtonShow(true);
    } else {
      setIsEditButtonShow(false);
    }
  };

  //for updtae image give refrence to image privew
  const updateGroupImageClick = () => {
    if (fileImageRef.current) {
      fileImageRef.current.click();
    }
  };

  const updateGroupData = async () => {
    setIsLoading(true);
    let response = await updateGroupDetailData(selectedGroup?.id || "", updateGroupName_, updateGroupImage || null);
    if (response?.success) {
      setIsLoading(false);
      setChatRoom((prevChatRooms) =>
        prevChatRooms.map((group) =>
          group.id === selectedGroup?.id
            ? {
              ...group,
              name: updateGroupName_,
              groupImage: updateGroupImage
                ? URL.createObjectURL(updateGroupImage)
                : group.groupImage,
            }
            : group
        )
      );
      setSelectedGroup((prevSelectedGroup) => {
        if (prevSelectedGroup) {
          return {
            ...prevSelectedGroup,
            name: updateGroupName_,
            groupImage: updateGroupImage
              ? URL.createObjectURL(updateGroupImage)
              : prevSelectedGroup.groupImage,
            id: prevSelectedGroup.id,             // Ensure `id` is present
            type: prevSelectedGroup.type,         // Include all required properties
            image: prevSelectedGroup.image,       // Maintain other properties
            participants: prevSelectedGroup.participants
          };
        }
        return null;
      });

      toast.success("Successfully Update Group Detail....");
      setIsEditButtonShow(false);
      setIsEditingGroup(false);

      setUpdateGroupName("");
      setUpdateImagePreview("");
      setpUdateGroupImage(null);

    } else if (response?.status === 401) {
      setIsLoading(false);
      handleUnauthorized(response.message);
    } else {
      setIsLoading(false);
      toast.error(response?.message, {
        style: {
          fontSize: '15px',
          fontWeight: 'bold',
          width: '400px',
        },
      });
    }

  }

  const deleteGroup = (groupId: string) => {
    // setGroups(groups.filter(group => group.id !== groupId));
    // if (selectedGroup?.id === groupId) setSelectedGroup(null);
  };

  const addParticipant = async (groupId: string, user: Contact) => {
    setIsLoading(true);



    let response = await addParticipant_(groupId, user);
    if (response?.success) {
      setIsLoading(false);
      toast.success("Successfully Add Contact in group ....");
      setChatRoom(chatRoom.map(room => {
        if (room.id === groupId && !room.participants.find(p => p.id === user.id)) {
          return {
            ...room,
            participants: [...room.participants, response.message]
          };
        }
        return room;
      }));

      setSelectedGroup(prevGroup => {
        if (prevGroup) {
          const isAlreadyParticipant = prevGroup.participants.some(
            participant => participant.id === response.message.id
          );

          // If not, add the new participant
          if (!isAlreadyParticipant) {
            return {
              ...prevGroup,
              participants: [...prevGroup.participants, response.message]
            };
          }
        }
        return prevGroup; // If no changes, return previous state
      });

      setIsEditButtonShow(false);
      setIsEditingGroup(false);
      setUpdateGroupName("");
      setUpdateImagePreview("");
      setpUdateGroupImage(null);

    } else if (response?.status === 401) {
      setIsLoading(false);
      handleUnauthorized(response.message);
    } else {
      setIsLoading(false);
      toast.error(response?.message, {
        style: {
          fontSize: '15px',
          fontWeight: 'bold',
          width: '400px',
        },
      });
    }
  };

  const removeParticipant = (groupId: string, userId: string) => {
    // setGroups(groups.map(group => {
    //   if (group.id === groupId) {
    //     return { ...group, participants: group.participants.filter(p => p.id !== userId) };
    //   }
    //   return group;
    // }));
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}
      <Navbar />
      <main className="flex h-screen" style={{ marginLeft: "150px" }}>
        {/* Sidebar */}
        <div className="w-80 border-r bg-gray-50 h-full p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Groups</h2>
            <button
              onClick={() => setIsCreateGroupOpen(true)}
              className="p-2 hover:bg-gray-200 rounded-full"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search Groups..."
            value={searchTermForGroup}
            onChange={(e) => setSearchTermForGroup(e.target.value)}
            className="w-full p-2 mb-4 border rounded-lg"
          />

          {/* Group List */}
          <div className="space-y-2">
            {Array.isArray(chatRoom) && chatRoom
              .filter((group) =>
                group.name.toLowerCase().includes(searchTermForGroup.toLowerCase())
              )
              .map((group) => (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroupDetail(group)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedGroup?.id === group.id
                    ? 'bg-blue-100'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  <img
                    src={group.groupImage}
                    alt={group.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="flex-1">{group.name}</span>
                </div>
              ))}
          </div>
        </div>


        {/* Main Content */}
        <div className="flex-1 p-6">
          {selectedGroup ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">

                  {isEditingGroup ? (
                    <>
                      <img
                        src={updateImagePreview || selectedGroup.groupImage}
                        alt={selectedGroup.name}
                        className="w-16 h-16 rounded-full cursor-pointer hover:opacity-80 transition"
                        onClick={updateGroupImageClick}
                      />


                      <input
                        type="file"
                        accept="image/*"
                        ref={fileImageRef}
                        onChange={updateGroupImageChange}
                        className="hidden"
                      />

                      <input
                        type="text"
                        value={updateGroupName_}
                        onChange={(e) => updateGroupName(e.target.value)}
                        className="border p-2 rounded"
                        autoFocus
                      />

                      {isEditButtonShow ? (
                        <button
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
                          onClick={updateGroupData}
                        >
                          <Save className="w-5 h-5" />
                          Update Group
                        </button>
                      ) : (<>
                      </>)}
                    </>
                  ) : (
                    <>      <img
                      src={selectedGroup.groupImage}
                      alt={selectedGroup.name}
                      className="w-16 h-16 rounded-full"
                    />
                      <h1 className="text-2xl font-bold">{selectedGroup.name}</h1></>

                  )
                  }
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditingGroup(true);    // First action
                      setUpdateGroupName(selectedGroup.name); // Second action
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  {permission ? (
                    <>
                      <button
                        onClick={() => setShowParticipantSelector(true)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteGroup(selectedGroup.id)}
                        className="p-2 hover:bg-gray-100 rounded-full text-red-500"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </>
                  )
                    : (<>
                    </>)
                  }
                </div>
              </div>

              {/* Participants List */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Participants</h2>
                <div className="space-y-3">
                  {selectedGroup.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={participant.user.profilePic || "#"}
                          alt={participant.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <span>{participant.user.name}</span>
                      </div>
                      <button
                        onClick={() => removeParticipant(selectedGroup.id, participant.id)}
                        className="p-2 hover:bg-gray-200 rounded-full text-red-500"
                      >
                        <UserMinus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a group to view details
            </div>
          )}
        </div>

        {/* Create Group Dialog */}
        {isCreateGroupOpen && (
          <div className="fixed inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <div className="bg-white bg-opacity-30 backdrop-blur-lg rounded-3xl p-8 w-96 shadow-2xl">
              <h2 className="text-3xl font-extrabold mb-6 text-center text-white drop-shadow-lg">
                Create New Group
              </h2>

              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group Name"
                className="w-full border border-gray-300 bg-white bg-opacity-70 p-3 rounded-full mb-4 text-gray-800 shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-400 transition duration-300"
              />

              <label className="block mb-4 text-white font-medium">
                Group Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-300"
                />
              </label>

              {imagePreview && (
                <div className="mb-6">
                  <img
                    src={imagePreview}
                    alt="Group Preview"
                    className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-xl transform hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsCreateGroupOpen(false)}
                  className="px-6 py-2 rounded-full text-gray-600 bg-white bg-opacity-70 hover:bg-opacity-90 transition duration-300 shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={createGroup}
                  className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-600 hover:to-purple-600 transition duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
        {showParticipantSelector && selectedGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl w-96 shadow-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-extrabold mb-4 text-gray-800 text-center sticky top-0 bg-white">
                Add Participants
              </h2>

              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="space-y-4">
                {paginatedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-blue-500"
                      />
                      <span className="text-lg font-medium text-gray-700">
                        {user.name}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        addParticipant(selectedGroup.id, user);
                        setShowParticipantSelector(false);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-transform duration-200"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowParticipantSelector(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main >

    </>
  );
}