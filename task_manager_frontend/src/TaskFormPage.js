import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "./api";
import { useAuth } from "./AuthContext";
import "./TaskFormPage.css";

// PUBLIC_INTERFACE
export default function TaskFormPage({ editMode }) {
  const { token } = useAuth();
  const { taskId } = useParams();
  const nav = useNavigate();
  const [task, setTask] = useState({ title: "", description: "", status: "todo" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMode && taskId) {
      setLoading(true);
      api.getTask(token, taskId)
        .then(setTask)
        .catch(e => setErr(e?.detail || "Failed to load task"))
        .finally(() => setLoading(false));
    }
  }, [editMode, taskId, token]);

  const handleChange = e => setTask(t => ({ ...t, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (editMode) {
        await api.updateTask(token, taskId, { title: task.title, description: task.description, status: task.status });
        nav(`/tasks/${taskId}`);
      } else {
        await api.createTask(token, task);
        nav("/tasks");
      }
    } catch (e) {
      setErr(e?.detail?.[0]?.msg || e?.detail || "Failed to save task");
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (window.confirm("Delete this task? This cannot be undone.")) {
      try {
        await api.deleteTask(token, taskId);
        nav("/tasks");
      } catch (e) {
        setErr(e?.detail || "Delete failed");
      }
    }
  }

  return (
    <section className="task-form-section">
      <h2>{editMode ? "Edit Task" : "New Task"}</h2>
      <form className="task-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            className="input"
            name="title"
            required
            value={task.title}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            disabled={loading}
          />
        </label>
        <label>
          Description
          <textarea
            className="input"
            name="description"
            value={task.description}
            onChange={handleChange}
            rows={3}
            maxLength={1000}
            disabled={loading}
          />
        </label>
        <label>
          Status
          <select
            className="input"
            name="status"
            value={task.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <div className="task-form-actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : (editMode ? "Update" : "Create")}
          </button>
          {editMode && (
            <button className="btn btn-secondary" onClick={handleDelete} type="button" disabled={loading}>
              Delete
            </button>
          )}
          <button className="btn btn-accent" onClick={() => nav("/tasks")} type="button">Cancel</button>
        </div>
        {err && <div className="error">{err}</div>}
      </form>
    </section>
  );
}
