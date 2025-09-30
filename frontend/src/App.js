import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CallLogs from "./pages/Calllogs";
import Profile from "./pages/Profile";
import Departments from "./pages/Departments";
import Voicetest from "./pages/Voicetest";
import Charts from './pages/Charts'

function App() {
  // for now hardcode, later connect with login state
  const isLoggedIn = true;

  return (
    <Routes>
      {/* Login page */}
      <Route path="/" element={<Login />} />

      {/* Protected pages */}
      <Route
        path="/call"
        element={isLoggedIn ? <CallLogs /> : <Navigate to="/" />}
      />
      <Route
        path="/profile"
        element={isLoggedIn ? <Profile /> : <Navigate to="/" />}
      />
      <Route
        path="/departments"
        element={isLoggedIn ? <Departments /> : <Navigate to="/" />}
      />
         <Route
        path="/test"
        element={isLoggedIn ? < Voicetest /> : <Navigate to="/" />}
      />
         <Route
        path="/charts"
        element={isLoggedIn ? < Charts /> : <Navigate to="/" />}
      />


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
