import React from "react";
import { FaHeart, FaComment, FaBookmark } from "react-icons/fa";

const FeedPage = () => {
  // Example posts with real pet images from Pinterest
  const posts = [
    {
      id: 1,
      user: "Alice Johnson",
      avatar:
        "https://i.pinimg.com/474x/03/eb/d6/03ebd625cc0b9d636256ecc44c0ea324.jpg",
      image:
        "https://i.pinimg.com/474x/c5/a0/97/c5a0971c45dac6933b010cb0befffbbb.jpg",
      description: "Meet Bella! She's the sweetest pup ever. 🐶❤️",
      likes: 120,
      comments: 15,
    },
    {
      id: 2,
      user: "John Doe",
      avatar:
        "https://i.pinimg.com/474x/97/bb/06/97bb067e30ff6b89f4fbb7b9141025ca.jpg",
      image:
        "https://i.pinimg.com/474x/03/56/03/035603c06092c19f303cc35761b908c2.jpg",
      description: "Max is loving his new toy! 🐕🎾",
      likes: 200,
      comments: 30,
    },
    {
      id: 3,
      user: "Emma Wilson",
      avatar:
        "https://i.pinimg.com/474x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg",
      image:
        "https://i.pinimg.com/474x/ee/a8/fe/eea8fe25fd6efcb9eea8e2b883621287.jpg",
      description: "Luna enjoying a sunny day outside! 🌞🐕",
      likes: 150,
      comments: 22,
    },
    {
      id: 4,
      user: "Sophia Carter",
      avatar:
        "https://i.pinimg.com/474x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg",
      image:
        "https://i.pinimg.com/474x/de/4b/ad/de4bad152981a73dca7dfbb2761eb6e0.jpg",
      description: "Charlie loves his cat naps. 😻💤",
      likes: 180,
      comments: 40,
    },
  ];

  return (
    <div className="p-4 ">
      <h1 className="text-3xl font-bold mb-6 text-center">Feed</h1>

      {/* Instagram-style grid layout */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> */}
      <div className="flex flex-col gap-6 w-lg mx-auto  ">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* User Info */}
            <div className="flex items-center p-4">
              <img
                src={post.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
              <span className="font-semibold">{post.user}</span>
            </div>

            {/* Post Image */}
            <img
              src={post.image}
              alt="Pet"
              className="w-full h-64 object-cover"
            />

            {/* Actions */}
            <div className="flex justify-between p-4 text-gray-600">
              <button className="flex items-center space-x-1 hover:text-red-500">
                <FaHeart /> <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-500">
                <FaComment /> <span>{post.comments}</span>
              </button>
              <button className="hover:text-yellow-500">
                <FaBookmark />
              </button>
            </div>

            {/* Description */}
            <div className="p-4">
              <p className="text-gray-800">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
