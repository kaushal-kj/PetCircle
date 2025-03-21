import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/src/assets/logo1.png" // Replace with your logo path
                alt="PetCircle Logo"
              />
              <span className="ml-2 text-xl font-semibold text-gray-800">
                PetCircle
              </span>
            </Link>
          </div>

          {/* Right Side: Sign Up and Login Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-800 hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
