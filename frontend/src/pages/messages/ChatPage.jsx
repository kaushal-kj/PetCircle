// import { useState } from "react";
// import ChatSidebar from "./ChatSidebar";
// import ChatBox from "./ChatBox";

// // const ChatPage = ({ onlineUsers }) => {
// //   const currentUserId = localStorage.getItem("id");
// //   const [selectedUser, setSelectedUser] = useState(null);

// //   return (
// //     <div className="flex h-screen">
// //       <ChatSidebar
// //         onlineUsers={onlineUsers}
// //         currentUserId={currentUserId}
// //         selectedUserId={selectedUser?._id}
// //         onSelectUser={setSelectedUser}
// //       />
// //       {selectedUser ? (
// //         <ChatBox currentUserId={currentUserId} receiver={selectedUser} />
// //       ) : (
// //         <div className="w-2/3 flex items-center justify-center">
// //           <p className="text-gray-400 text-lg">
// //             Select a user to start chatting
// //           </p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };
// const ChatPage = ({ onlineUsers }) => {
//   const currentUserId = localStorage.getItem("id");
//   const [selectedUser, setSelectedUser] = useState(null);

//   return (
//     <div className="flex h- bg-gray-100">
//       <ChatSidebar
//         onlineUsers={onlineUsers}
//         currentUserId={currentUserId}
//         selectedUserId={selectedUser?._id}
//         onSelectUser={setSelectedUser}
//       />
//       {selectedUser ? (
//         <div className="flex-1 bg-white shadow-md flex flex-col">
//           <ChatBox currentUserId={currentUserId} receiver={selectedUser} />
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center text-gray-500">
//           <p className="text-xl font-medium">Select a user to start chatting</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatPage;
import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatBox from "./ChatBox";

const ChatPage = ({ onlineUsers }) => {
  const currentUserId = localStorage.getItem("id");
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-[300px] border-r border-gray-200">
        <ChatSidebar
          onlineUsers={onlineUsers}
          currentUserId={currentUserId}
          selectedUserId={selectedUser?._id}
          onSelectUser={setSelectedUser}
        />
      </div>

      {/* Chat Box or Placeholder */}
      <div className="flex-1">
        {selectedUser ? (
          <ChatBox currentUserId={currentUserId} receiver={selectedUser} />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <p className="text-gray-400 text-lg">
              Select a user to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
