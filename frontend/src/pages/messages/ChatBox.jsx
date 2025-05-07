import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket"; // Adjust path as needed
import axios from "axios";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const ChatBox = ({ currentUserId, receiver }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const bottomRef = useRef();
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef();
  useEffect(() => {
    if (receiver) {
      inputRef.current?.focus();
    }
  }, [receiver]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!receiver) return;

      try {
        const res = await axios.get(
          `/message/all/${receiver._id}?senderId=${currentUserId}`
        );
        setMessages(res.data.data || []);

        // Mark messages as seen
        await axios.put(`/mark-seen/${receiver._id}`, {
          senderId: currentUserId,
        });
      } catch (err) {
        console.error("Failed to load or mark messages:", err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [receiver, messages.length]);

  useEffect(() => {
    if (!socket || !receiver) return;

    const handleNewMessage = (newMessage) => {
      const isRelevant =
        (newMessage.senderId === receiver._id &&
          newMessage.receiverId === currentUserId) ||
        (newMessage.senderId === currentUserId &&
          newMessage.receiverId === receiver._id);

      if (isRelevant) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [receiver]);

  useEffect(() => {
    if (!socket || !receiver) return;

    const handleMessagesSeen = ({ by }) => {
      if (by === receiver._id) {
        // Update local messages' seen flag if current receiver saw them
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.receiverId === receiver._id ? { ...msg, seen: true } : msg
          )
        );
      }
    };

    socket.on("messagesSeen", handleMessagesSeen);
    return () => socket.off("messagesSeen", handleMessagesSeen);
  }, [receiver]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    try {
      const res = await axios.post(`/message/send/${receiver._id}`, {
        senderId: currentUserId,
        message: newMsg,
      });
      setMessages((prev) => [...prev, res.data.data]);
      setNewMsg("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white">
      {/* Header */}
      <div className="p-4 bg-gray-50 flex items-center gap-3 sticky top-0 z-10 shadow-md">
        <img
          src={receiver.profilePic || "/default-avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-[16px] text-gray-800">
            {receiver.fullName || receiver.username}
          </span>
          <span className="text-xs text-gray-500">Direct Message</span>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-100 space-y-3">
        {messages.map((msg, i) => {
          const isSender = msg.senderId === currentUserId;
          const isLastMsg = i === messages.length - 1;
          return (
            <div
              key={i}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm relative ${
                  isSender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.message}</p>
                <span
                  className={`text-[10px] block text-right mt-1 ${
                    isSender ? "text-gray-100" : "text-gray-500"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {isSender && isLastMsg && (
                  <span className="text-[10px] block text-right mt-1 italic">
                    {msg.seen ? "Seen" : "Delivered"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 bg-white flex items-center gap-3 sticky bottom-0 z-10 shadow-md">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPicker((prev) => !prev)}
            className="text-2xl"
          >
            😊
          </button>

          {showPicker && (
            <div className="absolute bottom-12 z-50">
              <Picker
                data={data}
                onEmojiSelect={(emoji) => {
                  setNewMsg((prev) => prev + emoji.native);
                }}
                theme="light"
              />
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // prevents newline
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
