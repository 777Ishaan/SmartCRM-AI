import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box } from "@mui/material";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Activities from "./pages/Activities";
import Calendar from "./pages/Calendar";
import Documents from "./pages/Documents";
import Analytics from "./pages/Analytics";
import AICopilot from "./pages/AICopilot";
import Settings from "./pages/Settings";

const ProtectedLayout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Sidebar />
      <Topbar />

      <Box
        component="main"
        sx={{
          ml: "250px",
          pt: "90px",
          px: 4,
          pb: 4,
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai-copilot" element={<AICopilot />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/" replace /> : <Login />
          }
        />

        {/* Protected CRM */}
        <Route
          path="/*"
          element={<ProtectedLayout />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;