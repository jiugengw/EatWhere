import "./App.css";
import SignupPage from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import History from "./pages/History";
import ViewGroupsPage from "./pages/ViewGroups";
import TestPage from "./pages/test";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/history" element={<History />} />
        <Route path="/groups" element={<ViewGroupsPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
