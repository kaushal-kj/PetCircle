// import { useEffect, useRef, useState } from "react";
// import { socket } from "../../socket"; // adjust path as needed
// import axios from "axios";

// const ChatBox = ({ currentUserId, receiver }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMsg, setNewMsg] = useState("");
//   const bottomRef = useRef();

//   useEffect(() => {
//     if (receiver) {
//       axios
//         .get(`/message/all/${receiver._id}?senderId=${currentUserId}`)
//         .then((res) => {
//           setMessages(res.data.data || []);
//         })
//         .catch((err) => {
//           console.error("Failed to load messages:", err);
//           setMessages([]); // fallback to avoid undefined
//         });
//     }
//   }, [receiver]);

//   //   useEffect(() => {
//   //     socket.on("newMessage", (message) => {
//   //       if (message.senderId === receiver._id) {
//   //         setMessages((prev) => [...prev, message]);
//   //       }
//   //     });

//   //     return () => socket.off("newMessage");
//   //   }, [receiver]);

//   useEffect(() => {
//     if (!socket || !receiver) return;

//     const handleNewMessage = (newMessage) => {
//       // Ensure message is for this conversation
//       const isRelevant =
//         (newMessage.senderId === receiver._id &&
//           newMessage.receiverId === currentUserId) ||
//         (newMessage.senderId === currentUserId &&
//           newMessage.receiverId === receiver._id);

//       if (isRelevant) {
//         setMessages((prev) => [...prev, newMessage]);
//       }
//     };

//     socket.on("newMessage", handleNewMessage);

//     return () => {
//       socket.off("newMessage", handleNewMessage);
//     };
//   }, [receiver]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async () => {
//     if (!newMsg) return;
//     try {
//       const res = await axios.post(`/message/send/${receiver._id}`, {
//         senderId: currentUserId,
//         message: newMsg,
//       });
//       setMessages((prev) => [...prev, res.data.data]);
//       setNewMsg("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="w-2/3 flex flex-col h-full">
//       <div className="p-4 border-b flex items-center gap-3">
//         <img
//           src={receiver.profilePic || "/default-avatar.png"}
//           className="w-10 h-10 rounded-full"
//           alt="avatar"
//         />
//         <span className="font-semibold text-lg">{receiver.username}</span>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`flex ${
//               msg.senderId === currentUserId ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div className="bg-white p-2 rounded shadow-sm max-w-xs">
//               {msg.message}
//             </div>
//           </div>
//         ))}
//         <div ref={bottomRef}></div>
//       </div>

//       <div className="p-4 border-t flex gap-2">
//         <input
//           value={newMsg}
//           onChange={(e) => setNewMsg(e.target.value)}
//           placeholder="Message..."
//           className="border rounded-full px-4 py-2 flex-1"
//         />
//         <button
//           onClick={handleSend}
//           className="bg-blue-500 text-white px-4 rounded-full"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;

import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket"; // adjust path
import axios from "axios";

const ChatBox = ({ currentUserId, receiver }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    if (receiver) {
      axios
        .get(`/message/all/${receiver._id}?senderId=${currentUserId}`)
        .then((res) => {
          setMessages(res.data.data || []);
        })
        .catch((err) => {
          console.error("Failed to load messages:", err);
          setMessages([]);
        });
    }
  }, [receiver]);

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
      <div className="p-4 border-b flex items-center gap-3 bg-white shadow-sm">
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
      <div className="flex-1 overflow-y-auto px-4 py-2 bg-gray-100 space-y-3">
        {messages.map((msg, i) => {
          const isSender = msg.senderId === currentUserId;
          return (
            <div
              key={i}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-md ${
                  isSender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.message}
                <span
                  className={`text-[10px] flex justify-end mt-1 text-right ${
                    isSender ? "text-gray-100 " : "text-gray-500"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 border-t bg-white flex items-center gap-3">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
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
