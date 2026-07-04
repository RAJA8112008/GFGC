import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuthSuccess from "./pages/AuthSuccess";
import Solutions from "./pages/Solutions";
import Repository from "./pages/Repository";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/repositories" element={<Repository />} />
      </Routes>
    </>
  );
}


export default App;