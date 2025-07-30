import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./LoginSignup.css";

// PUBLIC_INTERFACE
export default function SignupPage() {
  /** Signup page component. */
  const { signup, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      await signup(form);
      setMsg("Account created! You are now logged in.");
    } catch (error) {
      setErr(error?.detail?.[0]?.msg || error?.detail || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="title">Sign Up</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="username"
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={handleChange}
          minLength={6}
          required
          autoComplete="new-password"
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {err && <div className="error">{err}</div>}
        {msg && <div className="info">{msg}</div>}
      </form>
    </div>
  );
}
