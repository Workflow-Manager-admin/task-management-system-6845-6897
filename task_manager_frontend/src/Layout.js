import React from "react";
import { useAuth } from "./AuthContext";
import "./Layout.css";

// Color config:
const PRIMARY = "#1976d2";
const ACCENT = "#ff4081";
const SECONDARY = "#424242";

// PUBLIC_INTERFACE
export default function Layout({ children }) {
  /** Renders the complete app layout: sidebar, topbar, and main area. */
  const { user, logout } = useAuth();

  return (
    <div className="layout-root">
      <aside className="sidebar">
        <div className="sidebar-title">TASKY</div>
        <nav>
          <a className="sidebar-link" href="/tasks">My Tasks</a>
          <a className="sidebar-link" href="/tasks/new">+ New Task</a>
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div style={{ flexGrow: 1 }}></div>
          <div className="user-profile">
            <span>{user?.email}</span>
            <button className="btn btn-accent" onClick={logout} style={{ marginLeft: 16 }}>Logout</button>
          </div>
        </header>
        <div className="main-area">{children}</div>
      </main>
    </div>
  );
}
