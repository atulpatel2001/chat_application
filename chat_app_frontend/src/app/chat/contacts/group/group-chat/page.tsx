'use client';

import { useState } from 'react';
import { MoreVertical, Plus, Settings, UserPlus, UserMinus, Edit2, Trash } from 'lucide-react';
import Navbar from '@/app/component/Navbar';

// Types
interface Group {
  id: string;
  name: string;
  image: string;
  participants: User[];
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
  { id: '2', name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
  { id: '3', name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
];

export default function Home() {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Team Alpha',
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=1',
      participants: [mockUsers[0], mockUsers[1]],
    },
    {
      id: '2',
      name: 'Project Beta',
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=2',
      participants: [mockUsers[1], mockUsers[2]],
    },
  ]);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [showParticipantSelector, setShowParticipantSelector] = useState(false);

  // Group Management Functions
  const createGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: newGroupName,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${Date.now()}`,
        participants: [],
      };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setIsCreateGroupOpen(false);
    }
  };

  const updateGroupName = (groupId: string, newName: string) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, name: newName } : group
    ));
    setIsEditingGroup(false);
  };

  const deleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
    if (selectedGroup?.id === groupId) setSelectedGroup(null);
  };

  const addParticipant = (groupId: string, user: User) => {
    setGroups(groups.map(group => {
      if (group.id === groupId && !group.participants.find(p => p.id === user.id)) {
        return { ...group, participants: [...group.participants, user] };
      }
      return group;
    }));
  };

  const removeParticipant = (groupId: string, userId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return { ...group, participants: group.participants.filter(p => p.id !== userId) };
      }
      return group;
    }));
  };

  return (
    <>
    <main className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r bg-gray-50 h-full p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Groups</h2>
          <button
            onClick={() => setIsCreateGroupOpen(true)}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Group List */}
        <div className="space-y-2">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                selectedGroup?.id === group.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              <img
                src={group.image}
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
                <img
                  src={selectedGroup.image}
                  alt={selectedGroup.name}
                  className="w-16 h-16 rounded-full"
                />
                {isEditingGroup ? (
                  <input
                    type="text"
                    value={selectedGroup.name}
                    onChange={(e) => updateGroupName(selectedGroup.id, e.target.value)}
                    onBlur={() => setIsEditingGroup(false)}
                    className="border p-2 rounded"
                    autoFocus
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{selectedGroup.name}</h1>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditingGroup(true)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
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
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span>{participant.name}</span>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Group</h2>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group Name"
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCreateGroupOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participant Selector Dialog */}
      {showParticipantSelector && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Participants</h2>
            <div className="space-y-2">
              {mockUsers
                .filter(user => !selectedGroup.participants.find(p => p.id === user.id))
                .map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span>{user.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        addParticipant(selectedGroup.id, user);
                        setShowParticipantSelector(false);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowParticipantSelector(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>

    </>
  );
}