// App.tsx
import "./App.css";
import SignupPage from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import History from "./pages/History";
import BurgerPage from "./pages/burger";
import Loading from "./shared/UIelements/loading";
import Navbar from "./shared/components/navbar";
import ViewGroupsPage from "./pages/ViewGroups";
import UserProfile from "./pages/testauthpage";
import ProfilePage from "./pages/UserProfile";
import PreferencesPage from "./pages/Preferences";
import TestHome from "./pages/testhome";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/history" element={<History />} />
        <Route path="/groups" element={<ViewGroupsPage />} />
        <Route path="/burger" element={<BurgerPage />} />
        <Route path="/load" element={<Loading />} />
        <Route path="/test" element={<UserProfile />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/preference" element={<PreferencesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
