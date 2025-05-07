import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-green-50 py-20 relative overflow-hidden">
      {/* Background Illustration */}
      <div className="absolute inset-0 bg-[url('/src/assets/pet-background.svg')] bg-cover bg-center opacity-10"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl font-bold text-gray-800 sm:text-5xl md:text-6xl">
            Welcome to <span className="text-green-500">PetCircle</span>
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-lg text-gray-600 sm:mt-5 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-5 md:text-2xl">
            The ultimate social platform for pet lovers. Connect, share, and
            care for your pets like never before.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="mt-8 sm:mt-10 sm:flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-300 md:py-4 md:text-lg md:px-10"
            >
              Join the Community
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition duration-300 md:py-4 md:text-lg md:px-10"
            >
              Sign In
            </Link>
          </div>

          {/* Statistics Section */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">10,000+</p>
              <p className="text-sm text-gray-600">Happy Pets</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">5,000+</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">100+</p>
              <p className="text-sm text-gray-600">Expert Trainers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">24/7</p>
              <p className="text-sm text-gray-600">Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
