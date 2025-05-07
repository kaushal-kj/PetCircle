import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import icons

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/user/login", data);
      if (response.status === 200) {
        // console.log(response.data);
        // toast.success("Login Successful! Redirecting to Main Page...");
        toast.success("Login Successful! ", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        });
        localStorage.setItem("id", response.data.data._id);
        localStorage.setItem("username", response.data.data.username);
        localStorage.setItem(
          "profilePic",
          response.data.data.profilePic || "https://via.placeholder.com/50"
        );

        localStorage.setItem("role", response.data.data.role);
        localStorage.setItem("email", response.data.data.email);
        setTimeout(() => {
          if (response.data.data.role === "admin") {
            navigate("/admin");
          } else if (response.data.data.role === "petOwner") {
            navigate("/main/feeds");
          } else if (response.data.data.role === "expert") {
            if (response.data.requiresCertificateUpload) {
              navigate("/expert/profile");
            } else {
              navigate("/expert/feeds");
            }
          }
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        // toast.error(error.response.data.message || "Login Failed");
        toast.error(error.response.data.message || "Login Failed", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        });
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // Validation rules
  const validationRules = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    },
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
            Login to Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-600 hover:text-green-500">
              Sign up here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", validationRules.email)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", validationRules.password)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm pr-10"
                placeholder="Password"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500 hover:text-gray-800"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="mt-2 text-end text-sm text-gray-600">
              <Link
                to="/forgot-pass"
                className="text-green-600 hover:text-green-500"
              >
                Forgot Password?
              </Link>
            </p>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group cursor-pointer relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
