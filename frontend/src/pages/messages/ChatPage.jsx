import { useEffect, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatBox from "./ChatBox";
import { useParams } from "react-router-dom";
import axios from "axios";

const ChatPage = ({ onlineUsers }) => {
  const { userId } = useParams(); // From route
  const currentUserId = localStorage.getItem("id");
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Open sidebar automatically on desktop, close on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-[calc(100vh-120px)] mt-4 mb-0 bg-white relative">
      {/* Sidebar */}
      {!sidebarOpen && (
        <button
          className="sm:hidden fixed top-15 left-3 z-20 bg-blue-600 text-white px-2 py-1 rounded shadow"
          onClick={() => setSidebarOpen(true)}
        >
          Chats
        </button>
      )}
      <div
        className={`
    fixed sm:static left-0 z-10 h-full bg-white border-r border-gray-200
    transition-transform duration-200
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    w-full max-w-xs sm:w-[320px] sm:max-w-none
    overflow-y-auto
    top-12 sm:top-0
  `}
      >
        {/* Mobile Close Button */}
        <div className="sm:hidden flex justify-end p-2 border-b">
          <button
            className="text-gray-600 px-3 py-1 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="px-6 pt-2 pb-2">
          <h2 className="text-2xl font-semibold mb-2">Messages</h2>
        </div>
        <ChatSidebar
          onlineUsers={onlineUsers}
          currentUserId={currentUserId}
          selectedUserId={selectedUser?._id}
          onSelectUser={(user) => {
            if (window.innerWidth < 640) setSidebarOpen(false);
            setTimeout(() => setSelectedUser(user), 0); // Ensures sidebar closes first
          }}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-0 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div
        className={`flex-1 px-2 sm:px-0 flex items-center justify-center relative
    ${sidebarOpen ? "hidden sm:flex" : "flex"}`}
      >
        {selectedUser ? (
          <ChatBox currentUserId={currentUserId} receiver={selectedUser} />
        ) : (
          <div className="text-center px-4">
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
