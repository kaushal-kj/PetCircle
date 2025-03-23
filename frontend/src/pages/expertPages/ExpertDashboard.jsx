import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUserMd, FaUsers, FaClipboardList } from "react-icons/fa";
import { MdGridOn } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

const ExpertDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = location.pathname === "/expert";

  const handleLogout = () => {
    // ✅ Clear user session
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("profilePic");

    // ✅ Redirect to login page
    navigate("/login");
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white w-64 p-4 fixed min-h-screen">
        <h2 className="text-2xl font-bold mb-6">PetCircle</h2>
        <nav>
          <ul className="space-y-4">
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
                to="consultations"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FaClipboardList className="mr-2" /> Consultations
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
                to="profile"
                className="flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FaUserMd className="mr-2" /> Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-2 hover:bg-gray-800 rounded"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 ml-64">
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
