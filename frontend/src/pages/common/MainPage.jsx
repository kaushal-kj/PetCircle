import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaPaw,
  FaUsers,
  FaHandHoldingHeart,
  FaUserMd,
  FaTrophy,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdGridOn } from "react-icons/md";
import axios from "axios";
import { FaMessage } from "react-icons/fa6";

const MainPage = () => {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const isMainPage = location.pathname === "/main";

  const userId = localStorage.getItem("id");
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (userId) {
      axios
        .get(`/user/${userId}`)
        .then((response) => {
          setUser(response.data.data);
        })
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [userId]);

  const handleLogout = () => {
    //  Clear user session
    localStorage.clear();
    //  Redirect to login page
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 min-h-screen fixed text-white w-64 p-4 transform transition-transform duration-200 ease-in-out `}
      >
        <h2 className="text-2xl font-bold mb-6">PetCircle</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="feeds"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <MdGridOn className="mr-4 ml-1" /> Feeds
              </Link>
            </li>
            <li>
              <Link
                to="pets"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FaPaw className="mr-4 ml-1" /> My Pets
              </Link>
            </li>
            <li>
              <Link
                to="communities"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FaUsers className="mr-4 ml-1" /> Communities
              </Link>
            </li>
            <li>
              <Link
                to="messages"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FaMessage className="mr-4 ml-1" /> Messages
              </Link>
            </li>
            <li>
              <Link
                to="adoptions"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FaHandHoldingHeart className="mr-4 ml-1" /> Adoptions
              </Link>
            </li>
            <li>
              <Link
                to="experts"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FaUserMd className="mr-4 ml-1" /> Experts
              </Link>
            </li>
            <li>
              <Link
                to="profile"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                {/* <FaUserMd className="mr-2" /> */}
                <img
                  src={user?.profilePic || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-6 h-6 mr-3 rounded-full "
                />
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex text-red-400 items-center p-2 hover:bg-gray-800 rounded"
              >
                <FiLogOut className="mr-4 ml-1" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 ml-60">
        {isMainPage ? (
          <>
            {" "}
            <h1 className="text-3xl font-bold mb-6">Welcome to PetCircle!</h1>
            <p className="text-lg text-gray-700">
              Your go-to platform for all things pets.
            </p>
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default MainPage;
