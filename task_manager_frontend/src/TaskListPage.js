import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "./api";
import { useAuth } from "./AuthContext";
import "./TaskListPage.css";

// PUBLIC_INTERFACE
export default function TaskListPage() {
  /** Displays list of tasks (with filtering/sorting), and lets user create, edit, delete tasks. */
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({ status: "", sort_by: "created_at", sort_order: "desc", skip: 0, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function fetchTasks() {
    setError("");
    setLoading(true);
    try {
      let r = await api.getTasks(token, query);
      setTasks(r.tasks || []);
      setTotal(r.total);
    } catch (e) {
      setError(e?.detail || "Failed to load tasks");
    }
    setLoading(false);
  }

  useEffect(() => { fetchTasks(); /* eslint-disable-next-line */ }, [token, query.status, query.sort_by, query.sort_order]);

  function gotoEdit(task) {
    nav(`/tasks/${task.id}/edit`);
  }

  function gotoView(task) {
    nav(`/tasks/${task.id}`);
  }

  return (
    <section className="task-list-section">
      <header className="task-list-header">
        <h2>My Tasks</h2>
        <button className="btn btn-primary" onClick={() => nav("/tasks/new")}>+ New Task</button>
      </header>
      <div className="task-list-controls">
        <select
          value={query.status}
          onChange={e => setQuery(q => ({ ...q, status: e.target.value }))}
        >
          <option value="">All</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <span style={{ margin: "0 8px" }}>|</span>
        <label>
          Sort by:
          <select
            value={query.sort_by}
            onChange={e => setQuery(q => ({ ...q, sort_by: e.target.value }))}
          >
            <option value="created_at">Created</option>
            <option value="updated_at">Last Updated</option>
          </select>
        </label>
        <select
          value={query.sort_order}
          onChange={e => setQuery(q => ({ ...q, sort_order: e.target.value }))}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>
      {loading ? <div>Loading tasks...</div> : null}
      {error && <div className="error">{error}</div>}
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item task-item--${task.status}`}>
            <div className="task-meta">
              <strong className="task-title" onClick={() => gotoView(task)} style={{ cursor: "pointer" }}>{task.title}</strong>
              <span className={`task-status status-${task.status}`}>{task.status.replace("_", " ")}</span>
              <span className="task-time">Created: {new Date(task.created_at).toLocaleString()}</span>
              <span className="task-time">Updated: {new Date(task.updated_at).toLocaleString()}</span>
            </div>
            <div className="task-actions">
              <button className="btn btn-small btn-accent" onClick={() => gotoEdit(task)}>Edit</button>
              <button className="btn btn-small btn-secondary" onClick={() => nav(`/tasks/${task.id}`)}>View</button>
            </div>
          </li>
        ))}
        {!loading && !tasks.length ? <div>No tasks found.</div> : null}
      </ul>
    </section>
  );
}
