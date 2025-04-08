// import { useEffect, useState } from "react";
// import axios from "axios";

// const ChatSidebar = ({ currentUserId, onSelectUser, onlineUsers }) => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     axios
//       .get("/users") // Replace with your actual API
//       .then((res) =>
//         setUsers(res.data.data.filter((u) => u._id !== currentUserId))
//       );
//   }, []);

//   const isUserOnline = (userId) => onlineUsers.includes(userId);

//   return (
//     <div className="w-1/4 border-r border-gray-300 p-4 overflow-y-auto">
//       <h2 className="text-xl font-semibold mb-4">Chats</h2>
//       {users.map((user) => (
//         <div
//           key={user._id}
//           onClick={() => onSelectUser(user)}
//           className="p-2 cursor-pointer hover:bg-gray-100 rounded flex items-center"
//         >
//           {/* <div className="relative"> */}
//           <img
//             src={user.profilePic || "https://i.pravatar.cc/40"}
//             alt={user.name}
//             className="w-10 h-10 rounded-full mr-3"
//           />
//           {/* {isUserOnline(user._id) && (
//               <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
//             )} */}
//           {/* </div> */}
//           <div className="flex flex-col">
//             <span className="text-lg font-medium">{user.fullName}</span>
//             <span
//               className={`text-[12px] font-medium ${
//                 isUserOnline(user._id) ? "text-green-600" : "text-red-500"
//               }`}
//             >
//               {isUserOnline(user._id) ? "online" : "offline"}
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ChatSidebar;

import { useEffect, useState } from "react";
import axios from "axios";

// const ChatSidebar = ({
//   currentUserId,
//   onSelectUser,
//   onlineUsers,
//   selectedUserId,
// }) => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     axios
//       .get("/users") // Replace with your actual API
//       .then((res) =>
//         setUsers(res.data.data.filter((u) => u._id !== currentUserId))
//       );
//   }, []);

//   const isUserOnline = (userId) => onlineUsers.includes(userId);

//   return (
//     <div className="w-[320px] bg-white border-r border-gray-200 p-4 overflow-y-auto shadow-sm">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 px-2">Chats</h2>

//       <div className="space-y-3">
//         {users.map((user) => {
//           const isOnline = isUserOnline(user._id);
//           const isSelected = selectedUserId === user._id;

//           return (
//             <div
//               key={user._id}
//               onClick={() => onSelectUser(user)}
//               className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
//                 ${isSelected ? "bg-blue-100" : "hover:bg-gray-100"}`}
//             >
//               <div className="relative">
//                 <img
//                   src={user.profilePic || "https://i.pravatar.cc/40"}
//                   alt={user.name}
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//                 {isOnline && (
//                   <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
//                 )}
//               </div>
//               <div>
//                 <p className="font-semibold text-gray-800">{user.fullName}</p>
//                 <p
//                   className={`text-xs ${
//                     isOnline ? "text-green-600" : "text-gray-400"
//                   }`}
//                 >
//                   {isOnline ? "Online" : "Offline"}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };
const ChatSidebar = ({ currentUserId, onSelectUser, onlineUsers }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/users")
      .then((res) =>
        setUsers(res.data.data.filter((u) => u._id !== currentUserId))
      );
  }, []);

  const isUserOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="w-full border-r border-gray-300 p-4 overflow-y-auto bg-white">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => onSelectUser(user)}
          className="p-2 cursor-pointer hover:bg-gray-100 rounded flex items-center gap-2"
        >
          <img
            src={user.profilePic || "https://i.pravatar.cc/40"}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.fullName}</span>
            <span
              className={`text-xs ${
                isUserOnline(user._id) ? "text-green-600" : "text-red-500"
              }`}
            >
              {isUserOnline(user._id) ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;
