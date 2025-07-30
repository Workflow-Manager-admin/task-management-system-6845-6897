import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Layout";
import TaskListPage from "./TaskListPage";
import TaskDetailPage from "./TaskDetailPage";
import TaskFormPage from "./TaskFormPage";

function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

function MainRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/tasks" /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/tasks" /> : <SignupPage />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/tasks/new" element={<TaskFormPage editMode={false} />} />
          <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="/tasks/:taskId/edit" element={<TaskFormPage editMode={true} />} />
          <Route index element={<Navigate to="/tasks" />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={user ? "/tasks" : "/login"} />} />
    </Routes>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Theme toggling logic
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <AuthProvider>
      <Router>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <MainRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
