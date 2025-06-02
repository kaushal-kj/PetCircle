import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaUserMd,
  FaFileAlt,
  FaHandHoldingHeart,
  FaNetworkWired,
  FaChartPie,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/admin";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const sidebarLinks = [
    {
      to: "/admin/overview",
      icon: <FaChartPie className="mr-3" />,
      label: "Overview",
    },
    {
      to: "/admin/users",
      icon: <FaUsers className="mr-3" />,
      label: "Manage Users",
    },
    {
      to: "/admin/experts",
      icon: <FaUserMd className="mr-3" />,
      label: "Manage Experts",
    },
    {
      to: "/admin/posts",
      icon: <FaFileAlt className="mr-3" />,
      label: "Manage Posts",
    },
    {
      to: "/admin/adoptions",
      icon: <FaHandHoldingHeart className="mr-3" />,
      label: "Manage Adoptions",
    },
    {
      to: "/admin/communities",
      icon: <FaNetworkWired className="mr-3" />,
      label: "Manage Communities",
    },
  ];

  return (
    <div className="flex min-h-screen bg-white">
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
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </Link>
              </li>
            ))}
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
                      {link.icon}
                      <span className="ml-3">{link.label}</span>
                    </Link>
                  </li>
                ))}
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
          <div>
            <h1 className="text-3xl font-bold mb-4">Welcome Admin 👋</h1>
            <p className="text-gray-600">
              Choose a section from the left to manage the platform.
            </p>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
