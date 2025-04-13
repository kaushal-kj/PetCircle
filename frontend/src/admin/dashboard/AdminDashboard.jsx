import React from "react";
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

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 fixed min-h-screen  bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">PetCircle Admin</h2>
        <nav className="space-y-4">
          <Link
            to="/admin/overview"
            className="flex items-center hover:bg-gray-800 px-3 py-2 rounded"
          >
            <FaChartPie className="mr-3" />
            Overview
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center hover:bg-gray-800 px-3 py-2 rounded"
          >
            <FaUsers className="mr-3" />
            Manage Users
          </Link>
          <Link
            to="/admin/experts"
            className="flex items-center hover:bg-gray-800 px-3 py-2 rounded"
          >
            <FaUsers className="mr-3" />
            Manage Experts
          </Link>
          <Link
            to="/admin/posts"
            className="flex items-center hover:bg-gray-800 px-3 py-2 rounded"
          >
            <FaFileAlt className="mr-3" />
            Manage Posts
          </Link>
          <Link
            to="/admin/adoptions"
            className="flex items-center hover:bg-gray-800 px-3 py-2 rounded"
          >
            <FaHandHoldingHeart className="mr-3" />
            Manage Adoptions
          </Link>
          <Link
            to="/admin/communities"
            className="flex items-center hover:bg-gray-800 px-3 py-2 rounded"
          >
            <FaNetworkWired className="mr-3" />
            Manage Communities
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className=" w-full flex items-center text-red-400 hover:text-white hover:bg-red-500  px-3 py-2 rounded"
        >
          <FiLogOut className="mr-3" />
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 ml-60 overflow-y-auto">
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
      </main>
    </div>
  );
};

export default AdminDashboard;
