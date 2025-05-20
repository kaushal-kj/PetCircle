import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/common/Home";
import SignUp from "./pages/common/SignUp";
import Login from "./pages/common/Login";
import MainPage from "./pages/common/MainPage";
import axios from "axios";
import PetsPage from "./pages/pets/PetsPage";
import CommunitiesPage from "./pages/community/CommunitiesPage";
import ExpertsPage from "./pages/expert/ExpertsPage";
import FeedPage from "./pages/feed/FeedPage";
import PrivateRoutes from "./hooks/PrivateRoutes";
import ProfilePage from "./pages/profile/ProfilePage";
import EditProfile from "./pages/profile/EditProfile";
import FullPostView from "./pages/profile/FullPostView";

import ExpertDashboard from "./pages/expertPages/ExpertDashboard";
import ExpertProfile from "./pages/expertPages/ExpertProfile";
import EditExpertProfile from "./pages/expertPages/EditExpertProfile";
import FullPostExpert from "./pages/expertPages/FullPostExpert";
import ResetPassword from "./pages/common/ResetPassword";
import ForgotPassword from "./pages/common/ForgotPassword";
import ViewExpertProfile from "./pages/expert/ViewExpertProfile";
import ViewProfile from "./pages/profile/ViewProfile";
import CommunityDetailsPage from "./pages/community/CommunityDetailsPage";
import ChatPage from "./pages/messages/ChatPage";
import AdoptionPage from "./pages/adoption/AdoptionPage";

import { socket } from "./socket";
import AdminDashboard from "./admin/dashboard/AdminDashboard";
import AdminOverview from "./admin/components/AdminOverview";
import ManageUsers from "./admin/adminpages/ManageUsers";
import ManagePosts from "./admin/adminpages/ManagePosts";
import ManageAdoptions from "./admin/adminpages/ManageAdoptions";
import ManageCommunities from "./admin/adminpages/ManageCommunities";
import ManageExperts from "./admin/adminpages/ManageExperts";

function App() {
  axios.defaults.baseURL = "http://localhost:3000";

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.off("getOnlineUsers");
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      axios.get(`/user/${id}`).catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 404) {
          localStorage.clear();
          navigate("/login");
        }
      });
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-pass" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />

        <Route path="" element={<PrivateRoutes />}>
          {/* admin routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="overview" element={<AdminOverview />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="experts" element={<ManageExperts />} />
            <Route path="posts" element={<ManagePosts />} />
            <Route path="adoptions" element={<ManageAdoptions />} />
            <Route path="communities" element={<ManageCommunities />} />
          </Route>

          {/* petowner routes */}
          <Route path="/main" element={<MainPage />}>
            <Route path="feeds" element={<FeedPage />} />
            <Route path="feeds/:id" element={<ViewProfile />} />
            <Route path="pets" element={<PetsPage />} />
            <Route path="communities" element={<CommunitiesPage />} />
            <Route path="communities/:id" element={<CommunityDetailsPage />} />
            <Route path="adoptions" element={<AdoptionPage />} />
            <Route
              path="messages"
              element={<ChatPage onlineUsers={onlineUsers} />}
            />
            <Route
              path="messages/:userId"
              element={<ChatPage onlineUsers={onlineUsers} />}
            />
            <Route path="experts" element={<ExpertsPage />} />
            <Route path="experts/:expertId" element={<ViewExpertProfile />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="profile/:id" element={<FullPostView />} />
          </Route>
          {/* expert routes */}
          <Route path="/expert" element={<ExpertDashboard />}>
            <Route path="feeds" element={<FeedPage />} />
            <Route path="feeds/:id" element={<ViewProfile />} />
            <Route path="pets" element={<PetsPage />} />
            <Route path="profile" element={<ExpertProfile />} />
            <Route path="profile/edit" element={<EditExpertProfile />} />
            <Route path="profile/:id" element={<FullPostExpert />} />
            <Route path="experts/:expertId" element={<ViewExpertProfile />} />
            <Route path="communities" element={<CommunitiesPage />} />
            <Route path="communities/:id" element={<CommunityDetailsPage />} />
            <Route
              path="messages"
              element={<ChatPage onlineUsers={onlineUsers} />}
            />
            <Route
              path="messages/:userId"
              element={<ChatPage onlineUsers={onlineUsers} />}
            />
            <Route path="adoptions" element={<AdoptionPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
