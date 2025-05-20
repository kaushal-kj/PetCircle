import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { socket } from "../../socket";

const ChatSidebar = ({ currentUserId, onSelectUser, onlineUsers }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Real-time update of last message on receiving newMessage
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (
            newMessage.senderId === u._id ||
            newMessage.receiverId === u._id
          ) {
            return {
              ...u,
              lastMessage: newMessage.message,
              lastMessageTime: newMessage.createdAt,
              lastMessageSender: newMessage.senderId,
              seen: newMessage.seen,
            };
          }
          return u;
        })
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", ({ by }) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === by ? { ...u, seen: true } : u))
      );
    });

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen");
    };
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role"); // petOwner, expert, or admin
    const currentUserId = localStorage.getItem("id");

    axios
      .get(`/users/with-chat-meta?currentUserId=${currentUserId}`)
      .then((res) => {
        let allUsers = res.data.data;

        // Remove current user from the list
        allUsers = allUsers.filter((u) => u._id !== currentUserId);

        // If current user is NOT admin, remove admins from list
        if (role !== "admin") {
          allUsers = allUsers.filter((u) => u.role !== "admin");
        }

        setUsers(allUsers);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user.fullName} ${user.username}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
  });

  const isUserOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="w-[95%] bg-white h-[90%] shadow-md overflow-y-auto">
      {/* Search bar */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* filtered user list */}
      <div className="flex-1 overflow-y-auto">
        {sortedUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              onSelectUser(user);
              setSearchTerm("");
            }}
            className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-100"
          >
            {/* Profile Pic with Online Dot */}
            <div className="relative">
              <img
                src={
                  user.profilePic || "https://i.pravatar.cc/150?u=" + user._id
                }
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              {isUserOnline(user._id) && (
                <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
              )}
            </div>

            {/* User Info */}
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">{user.fullName}</span>
                <span className="text-xs text-gray-500">
                  {/* {getLastSeenTime(user)} */}
                  {user.lastMessage && user.lastMessageTime
                    ? moment(user.lastMessageTime).format("hh:mm A")
                    : ""}
                </span>
              </div>
              <span className="text-sm text-gray-500 truncate">
                {/* {getLastMessagePreview(user, currentUserId)} */}
                {user.lastMessageSender === currentUserId
                  ? `You: ${user.lastMessage?.slice(0, 20)}${
                      user.lastMessage?.length > 20 ? "..." : ""
                    }`
                  : `${user.lastMessage?.slice(0, 20)}${
                      user.lastMessage?.length > 20 ? "..." : ""
                    }`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
