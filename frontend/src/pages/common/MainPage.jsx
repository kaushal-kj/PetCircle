import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaHome,
  FaPaw,
  FaUsers,
  FaHandHoldingHeart,
  FaUserMd,
  FaTrophy,
} from "react-icons/fa";
import { MdGridOn } from "react-icons/md";

const MainPage = () => {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const isMainPage = location.pathname === "/main";

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 min-h-screen fixed text-white w-64 p-4 transform transition-transform duration-200 ease-in-out `}
      >
        <h2 className="text-2xl font-bold mb-6">PetCircle</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="feeds"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <MdGridOn className="mr-2" /> Feeds
              </Link>
            </li>
            <li>
              <Link
                to="pets"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FaPaw className="mr-2" /> My Pets
              </Link>
            </li>
            <li>
              <Link
                to="communities"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FaUsers className="mr-2" /> Communities
              </Link>
            </li>
            <li>
              <Link
                to="adoptions"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FaHandHoldingHeart className="mr-2" /> Adoptions
              </Link>
            </li>
            <li>
              <Link
                to="experts"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FaUserMd className="mr-2" /> Experts
              </Link>
            </li>
            <li>
              <Link
                to="contests"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FaTrophy className="mr-2" /> Contests
              </Link>
            </li>
            <li>
              <Link
                to="profile"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FaUserMd className="mr-2" /> Profile
              </Link>
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
