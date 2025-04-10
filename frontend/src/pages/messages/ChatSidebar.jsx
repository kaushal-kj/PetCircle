import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { socket } from "../../socket";

const ChatSidebar = ({ currentUserId, onSelectUser, onlineUsers }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/users")
      .then((res) =>
        setUsers(res.data.data.filter((u) => u._id !== currentUserId))
      );
  }, []);

  // useEffect(() => {
  //   if (!socket) return;

  //   socket.on("userStatusChanged", ({ userId, isOnline, lastSeen }) => {
  //     setUsers((prevUsers) =>
  //       prevUsers.map((user) =>
  //         user._id === userId
  //           ? { ...user, isOnline, lastSeen: lastSeen || user.lastSeen }
  //           : user
  //       )
  //     );
  //   });

  //   return () => socket.off("userStatusChanged");
  // }, []);

  // ✅ Real-time update of last message on receiving newMessage
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
              lastSeen: newMessage.createdAt,
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
    axios
      .get(`/users/with-chat-meta?currentUserId=${currentUserId}`)
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const getLastMessagePreview = (user, currentUserId) => {
    if (!user.lastMessage) return "No messages yet";
    const isSentByYou = user.lastMessageSender === currentUserId;
    return `${isSentByYou ? "You: " : ""}${user.lastMessage}`;
  };

  const getLastSeenTime = (user) => {
    if (user.isOnline) return "Online";
    if (!user.lastSeen) return "A while ago";
    return moment(user.lastSeen).fromNow(); // e.g. "5 minutes ago"
  };

  const isUserOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="w-[95%] bg-white h-[85%] shadow-md overflow-y-auto">
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => onSelectUser(user)}
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
                  {user.lastSeen && user.lastMessage
                    ? moment(user.lastSeen).format("hh:mm A")
                    : ""}{" "}
                </span>
              </div>
              <span className="text-sm text-gray-500 truncate">
                {/* {getLastMessagePreview(user, currentUserId)} */}
                {user.lastMessageSender === currentUserId
                  ? `You: ${user.lastMessage}`
                  : user.lastMessage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
