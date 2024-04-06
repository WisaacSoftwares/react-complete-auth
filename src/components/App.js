import { AuthProvider } from "../context/AuthContext";
import { Container } from 'react-bootstrap';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import OnlyNotAuth from "./OnlyNotAuth";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";

function App() {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Routes>
          {/* Private Links */}
          <Route element={<RequireAuth />} >
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/update-profile" element={<UpdateProfile />} />
          </Route>

          {/* Only for not siged in users */}
          <Route element={<OnlyNotAuth />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Public links */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Container>
  );
}

export default App;
