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
import ContestsPage from "./pages/contest/ContestsPage";
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

function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  // useEffect(() => {
  //   if (socket) {
  //     console.log("Socket connected:", socket.id);
  //   }
  // }, []);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on("getOnlineUsers", (users) => {
      console.log(users);

      setOnlineUsers(users);
    });

    return () => socket.off("getOnlineUsers");
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
            <Route path="experts" element={<ExpertsPage />} />
            <Route path="experts/:expertId" element={<ViewExpertProfile />} />
            <Route path="contests" element={<ContestsPage />} />
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
            <Route path="adoptions" element={<AdoptionPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
