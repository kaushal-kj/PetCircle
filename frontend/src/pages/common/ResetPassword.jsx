// import axios from "axios";
// import React from "react";
// import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom";

// export const ResetPassword = () => {
//   const token = useParams().token;
//   const { register, handleSubmit } = useForm();
//   const submitHandler = async (data) => {
//     //resetpasseord api..
//     const obj = {
//       token: token,
//       password: data.password,
//     };
//     const res = await axios.post("/user/resetpassword", obj);
//     console.log(res.data);
//   };
//   return (
//     <div>
//       <h1>RESET PASSWOERD COMPONENT</h1>
//       <form onSubmit={handleSubmit(submitHandler)}>
//         <div>
//           <label>NEW PASSWORD</label>
//           <input type="text" {...register("password")}></input>
//         </div>
//         <div>
//           <input type="submit"></input>
//         </div>
//       </form>
//     </div>
//   );
// };

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/user/resetpassword", {
        token,
        password: data.password,
      });
      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="password"
            placeholder="New Password"
            className="border p-2 w-full rounded"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            className="border p-2 w-full rounded mt-2"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
