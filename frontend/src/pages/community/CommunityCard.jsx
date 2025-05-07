import React from "react";
import { Link } from "react-router-dom";

const CommunityCard = ({
  community,
  isJoined,
  isCreator,
  onJoin,
  onLeave,
  onDelete,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
      <img
        src={community.image}
        alt={community.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold">{community.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              👥 {community.members?.length || 0}{" "}
              {community.members?.length === 1 ? "member" : "members"}
            </p>
          </div>
          {isCreator && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded h-fit">
              Creator
            </span>
          )}
        </div>

        <p className="text-sm text-gray-700 mb-4">{community.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          {!isJoined ? (
            <button
              onClick={onJoin}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Join
            </button>
          ) : !isCreator ? (
            <button
              onClick={onLeave}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Leave
            </button>
          ) : null}

          {isCreator && (
            <button
              onClick={() => onDelete(community._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          )}

          <Link to={`${community._id}`}>
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
