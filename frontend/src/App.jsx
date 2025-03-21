import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/common/Home";
import SignUp from "./pages/common/SignUp";
import Login from "./pages/common/Login";
import MainPage from "./pages/common/MainPage";
import axios from "axios";
import PetsPage from "./pages/pets/PetsPage";
import CommunitiesPage from "./pages/community/CommunitiesPage";
import AdoptionsPage from "./pages/adoption/AdoptionsPage";
import ExpertsPage from "./pages/expert/ExpertsPage";
import ContestsPage from "./pages/contest/ContestsPage";
import FeedPage from "./pages/feed/FeedPage";
import PrivateRoutes from "./hooks/PrivateRoutes";
import ProfilePage from "./pages/profile/ProfilePage";
import EditProfile from "./pages/profile/EditProfile";

function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="" element={<PrivateRoutes />}>
          <Route path="/main" element={<MainPage />}>
            <Route path="feeds" element={<FeedPage />} />
            <Route path="pets" element={<PetsPage />} />
            <Route path="communities" element={<CommunitiesPage />} />
            <Route path="adoptions" element={<AdoptionsPage />} />
            <Route path="experts" element={<ExpertsPage />} />
            <Route path="contests" element={<ContestsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit" element={<EditProfile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
