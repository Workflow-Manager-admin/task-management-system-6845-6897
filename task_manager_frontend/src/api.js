//
// API utility to interact with FastAPI task manager backend.
// Handles authentication, token storage, and CRUD for tasks.
//

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

// PRIVATE: fetch helper with JSON payload and auth
async function apiFetch(url, { method = "GET", headers = {}, body, token, ...rest } = {}) {
  const opts = {
    method,
    headers: {
      ...(body && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers
    },
    ...(body && { body: JSON.stringify(body) }),
    ...rest
  };
  const resp = await fetch(`${API_BASE}${url}`, opts);
  if (resp.status === 204) return null; // DELETE
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw json;
  return json;
}

// PUBLIC_INTERFACE
export async function signup({ email, password }) {
  /** Create a new user. */
  return apiFetch("/auth/signup", {
    method: "POST",
    body: { email, password },
  });
}

// PUBLIC_INTERFACE
export async function login({ username, password }) {
  /** Authenticate user and receive JWT token. */
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  // grant_type/password flow
  const resp = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });
  const json = await resp.json();
  if (!resp.ok) throw json;
  return json;
}

// PUBLIC_INTERFACE
export async function getMe(token) {
  /** Fetch the current user's profile (returns {id, email}) */
  return apiFetch("/auth/me", { token });
}

// PUBLIC_INTERFACE
export async function getTasks(token, { status, sort_by, sort_order, skip, limit } = {}) {
  /** Get task list with optional filtering/sorting/pagination. */
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (sort_by) params.append("sort_by", sort_by);
  if (sort_order) params.append("sort_order", sort_order);
  if (skip) params.append("skip", skip);
  if (limit) params.append("limit", limit);
  return apiFetch(`/tasks?${params.toString()}`, { token });
}

// PUBLIC_INTERFACE
export async function createTask(token, { title, description, status }) {
  /** Create a task for the logged-in user. */
  return apiFetch("/tasks", {
    method: "POST",
    token,
    body: { title, description, status }
  });
}

// PUBLIC_INTERFACE
export async function updateTask(token, task_id, { title, description, status }) {
  /** Update an existing task. */
  return apiFetch(`/tasks/${task_id}`, {
    method: "PUT",
    token,
    body: { title, description, status }
  });
}

// PUBLIC_INTERFACE
export async function deleteTask(token, task_id) {
  /** Delete a task. */
  return apiFetch(`/tasks/${task_id}`, {
    method: "DELETE",
    token,
  });
}

// PUBLIC_INTERFACE
export async function getTask(token, task_id) {
  /** Get a single task by ID. */
  return apiFetch(`/tasks/${task_id}`, { token });
}
