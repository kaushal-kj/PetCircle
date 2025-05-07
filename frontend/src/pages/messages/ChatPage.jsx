import { useEffect, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatBox from "./ChatBox";
import { useParams } from "react-router-dom";
import axios from "axios";

const ChatPage = ({ onlineUsers }) => {
  const { userId } = useParams(); // From route
  const currentUserId = localStorage.getItem("id");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (userId) {
        try {
          const res = await axios.get(`/user/${userId}`);
          setSelectedUser(res.data.data);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }
    };
    fetchSelectedUser();
  }, [userId]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">
      {/* Sidebar */}
      <div className="w-[320px] border-r border-gray-200 ">
        <div className="px-6 pt-4 pb-2 ">
          <h2 className="text-2xl font-semibold mb-2">Messages</h2>
        </div>
        <ChatSidebar
          onlineUsers={onlineUsers}
          currentUserId={currentUserId}
          selectedUserId={selectedUser?._id}
          onSelectUser={setSelectedUser}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex items-center justify-center relative">
        {selectedUser ? (
          <ChatBox currentUserId={currentUserId} receiver={selectedUser} />
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 8h10M7 12h4m1 8.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">
              Your Messages
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Send private messages to a friend
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
