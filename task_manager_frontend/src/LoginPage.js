import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./LoginSignup.css";

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login page component. */
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setErr("");
    try {
      await login(form);
    } catch (error) {
      setErr(error?.detail?.[0]?.msg || error?.detail || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="title">Sign In</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          className="input"
          type="email"
          name="username"
          placeholder="Email"
          value={form.username}
          onChange={handleChange}
          required
          autoComplete="username"
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  );
}
