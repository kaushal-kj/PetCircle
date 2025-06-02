import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaUsers,
  FaClipboardList,
  FaPaw,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { MdGridOn } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";
import { FaMessage } from "react-icons/fa6";
import { HiMenu } from "react-icons/hi";

const ExpertDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/expert";
  const userId = localStorage.getItem("id");
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => {
    // Prevent background scroll when sidebar is open on mobile
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("profilePic");
    navigate("/login");
  };

  const sidebarLinks = [
    {
      to: "feeds",
      icon: <MdGridOn size={22} />,
      label: "Feeds",
    },
    {
      to: "pets",
      icon: <FaPaw size={22} />,
      label: "My Pets",
    },
    {
      to: "communities",
      icon: <FaUsers size={22} />,
      label: "Communities",
    },
    {
      to: "messages",
      icon: <FaMessage size={22} />,
      label: "Messages",
    },
    {
      to: "adoptions",
      icon: <FaHandHoldingHeart size={22} />,
      label: "Adoptions",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Top navbar for mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            className="text-white focus:outline-none mr-2"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle sidebar"
          >
            <HiMenu size={28} />
          </button>
          <span className="text-xl text-white font-bold">PetCircle</span>
        </div>
        <Link to="profile">
          <img
            src={user?.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        </Link>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex flex-col bg-gray-900 text-white w-64 min-h-screen fixed top-0 left-0 z-30 py-4">
        <div className="flex items-center mb-6 px-4">
          <span className="text-2xl font-bold">PetCircle</span>
        </div>
        <nav className="flex-1 w-full">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex items-center p-2 hover:bg-gray-800 rounded transition-colors"
                >
                  <span className="mr-4 ml-1">{link.icon}</span>
                  <span className="ml-3">{link.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="profile"
                className="flex items-center p-2 hover:bg-gray-800 rounded transition-colors"
              >
                <img
                  src={user?.profilePic || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-6 h-6 ml-1 rounded-full mr-3"
                />
                <span className="ml-3">Profile</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-2 hover:bg-gray-800 rounded text-red-400 transition-colors"
              >
                <FiLogOut className="mr-4 ml-2" />
                <span className="ml-3">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Drawer for mobile */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-transparent bg-opacity-40 z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>
          {/* Drawer */}
          <div className="fixed top-0 left-0 z-50 h-full w-56 bg-gray-900 text-white flex flex-col py-4 transition-transform duration-200">
            <div className="flex items-center justify-between mb-6 px-4">
              <span className="text-2xl font-bold">PetCircle</span>
              <button
                className="text-white text-2xl focus:outline-none"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                &times;
              </button>
            </div>
            <nav className="flex-1 w-full">
              <ul className="space-y-2">
                {sidebarLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="flex items-center p-2 hover:bg-gray-800 rounded transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="mr-4 ml-1">{link.icon}</span>
                      <span className="ml-3">{link.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="profile"
                    className="flex items-center p-2 hover:bg-gray-800 rounded transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <img
                      src={
                        user?.profilePic || "https://via.placeholder.com/150"
                      }
                      alt="Profile"
                      className="w-6 h-6 ml-1 rounded-full mr-3"
                    />
                    <span className="ml-3">Profile</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center p-2 hover:bg-gray-800 rounded text-red-400 transition-colors"
                  >
                    <FiLogOut className="mr-4 ml-2" />
                    <span className="ml-3">Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-200 ${
          sidebarOpen ? "md:ml-64" : "md:ml-64"
        } p-4 md:p-8`}
        style={{
          marginTop: window.innerWidth < 768 ? "56px" : "0px",
          pointerEvents:
            sidebarOpen && window.innerWidth < 768 ? "none" : "auto",
          userSelect: sidebarOpen && window.innerWidth < 768 ? "none" : "auto",
        }}
      >
        {isDashboard ? (
          <>
            <h1 className="text-3xl font-bold mb-6">Welcome, Expert!</h1>
            <p className="text-lg text-gray-700">
              Manage consultations, interact with communities, and share your
              expertise.
            </p>
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default ExpertDashboard;
