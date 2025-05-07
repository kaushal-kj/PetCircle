import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

const AddCommunityForm = ({ onClose, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();
  const [isloading, setisloading] = useState(false);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("creator", localStorage.getItem("id"));
    formData.append("image", data.image[0]);

    try {
      setisloading(true);
      await axios.post("/communities/create", formData);
      onSuccess();
      setisloading(false);
      onClose();
      reset();
    } catch (err) {
      console.error("Error creating community", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg w-full max-w-md shadow-md"
        encType="multipart/form-data"
      >
        <h2 className="text-xl font-semibold mb-4">Create Community</h2>

        <label className="block mb-2 text-sm">Name</label>
        <input
          {...register("name", { required: true })}
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Community Name"
        />

        <label className="block mb-2 text-sm">Description</label>
        <textarea
          {...register("description")}
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Short description"
        />

        <label className="block mb-2 text-sm">Image</label>
        <input
          type="file"
          accept="image/*"
          {...register("image", { required: true })}
          className="mb-4"
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isloading ? (
              <div className="flex items-center">
                <LoaderCircle className="animate-spin size-5" />
                <span className="ml-1.5"> Please wait</span>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCommunityForm;
