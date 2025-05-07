import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import { LoaderCircle } from "lucide-react";
import { FaChevronDown } from "react-icons/fa"; // Dropdown icon
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import icons

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const selectedRole = watch("role"); // Watch role selection
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  //  Validation Rules
  const validationRules = {
    role: { required: "Role is required" },
    username: {
      required: "Username is required",
      minLength: {
        value: 3,
        message: "Username must be at least 3 characters",
      },
      pattern: {
        value: /^\S*$/,
        message: "Username cannot contain spaces",
      },
    },
    fullName: { required: "Full Name is required" },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
    password: {
      required: "Password is required",
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      },
    },
    confirmPassword: {
      required: "Confirm Password is required",
      validate: (value) =>
        value === watch("password") || "Passwords do not match",
    },
    phoneNumber: {
      required: "Phone Number is required",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "Phone Number must be 10 digits",
      },
    },

    dateOfBirth:
      selectedRole === "petOwner"
        ? { required: "Date of Birth is required" }
        : {},

    expertise:
      selectedRole === "expert"
        ? { required: "Expertise field is required" }
        : {},

    terms: { required: "You must accept the terms and conditions" },
  };
  const checkPasswordStrength = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (strongRegex.test(password)) return "Strong";
    else if (mediumRegex.test(password)) return "Medium";
    else return "Weak";
  };

  //  Handle Form Submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/user/signup", data);
      if (response.status === 201) {
        // toast.success("Sign Up Successful! Redirecting to Login...");
        toast.success("Sign Up Successful! ", {
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
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign Up Failed", {
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
    } finally {
      setLoading(false);
    }
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
            Create Your Account
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:text-green-500">
              Login here
            </Link>
          </p>
        </div>

        {/* Form Start */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Role Dropdown */}
            <div className="relative">
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <select
                id="role"
                {...register("role", validationRules.role)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">Select Role</option>
                <option value="petOwner">Pet Owner</option>
                <option value="expert">Expert</option>
              </select>
              <FaChevronDown className="absolute right-3 top-3 text-gray-500" />
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Common Fields for All Roles */}
            <input
              type="text"
              {...register("username", validationRules.username)}
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded"
            />
            <input
              type="text"
              {...register("fullName", validationRules.fullName)}
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded"
            />
            <input
              type="email"
              {...register("email", validationRules.email)}
              placeholder="Email Address"
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", validationRules.password)}
                placeholder="Password"
                onChange={(e) => {
                  setPasswordStrength(checkPasswordStrength(e.target.value));
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded pr-10"
              />
              <span
                className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            {passwordStrength && (
              <p
                className={`text-sm mt-1 ${
                  passwordStrength === "Strong"
                    ? "text-green-600"
                    : passwordStrength === "Medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                Password strength: {passwordStrength}
              </p>
            )}

            <input
              type="password"
              {...register("confirmPassword", validationRules.confirmPassword)}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded"
            />
            <input
              type="tel"
              {...register("phoneNumber", validationRules.phoneNumber)}
              placeholder="Phone Number"
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded"
            />

            {/* Pet Owner Fields */}
            {selectedRole === "petOwner" && (
              <>
                <input
                  type="date"
                  {...register("dateOfBirth", validationRules.dateOfBirth)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded"
                />
              </>
            )}

            {/* Expert Fields */}
            {selectedRole === "expert" && (
              <>
                <input
                  type="text"
                  {...register("expertise", validationRules.expertise)}
                  placeholder="Expertise Field"
                  className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded"
                />
              </>
            )}
          </div>

          {/*  Terms and Conditions */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("terms", validationRules.terms)}
              className="h-4 w-4 text-green-600"
            />
            <span className="text-gray-700 text-sm">
              I agree to the{" "}
              <a href="/terms" className="text-green-600 hover:text-green-500">
                Terms and Conditions
              </a>
            </span>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoaderCircle className="animate-spin size-5" />
                <span className="ml-1.5"> Please wait</span>
              </div>
            ) : (
              "Sign up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
