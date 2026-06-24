import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuthSuccess from "./pages/AuthSuccess";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
    </Routes>
  );
}

export default App;