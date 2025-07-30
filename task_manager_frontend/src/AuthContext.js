import React, { useState, createContext, useContext, useEffect, useCallback } from "react";
import * as api from "./api";

// Types: { user: {id, email}, token: string, login, logout, signup, loading }

const AuthContext = createContext();

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("jwt") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (token) {
      api.getMe(token).then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // PUBLIC_INTERFACE
  const login = async ({ username, password }) => {
    setLoading(true);
    const r = await api.login({ username, password });
    setToken(r.access_token);
    localStorage.setItem("jwt", r.access_token);
    setLoading(false);
    return r;
  };

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    setUser(null);
    setToken("");
    localStorage.removeItem("jwt");
  }, []);

  // PUBLIC_INTERFACE
  const signup = async ({ email, password }) => {
    setLoading(true);
    await api.signup({ email, password });
    await login({ username: email, password });
    setLoading(false);
  };

  useEffect(() => {
    if (token && !user) {
      api.getMe(token).then(setUser).catch(logout);
    }
  }, [token, user, logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
