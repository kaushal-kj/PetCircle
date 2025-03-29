import React from "react";

const SimpleLoader = () => {
  return (
    <>
      <div
        className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin
                    aspect-square w-8 flex justify-center items-center text-yellow-700"
      />
    </>
  );
};

export default SimpleLoader;
