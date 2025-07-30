import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "./api";
import { useAuth } from "./AuthContext";
import "./TaskDetailPage.css";

// PUBLIC_INTERFACE
export default function TaskDetailPage() {
  const { token } = useAuth();
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    async function fetchIt() {
      setErr("");
      try {
        const result = await api.getTask(token, taskId);
        setTask(result);
      } catch (e) {
        setErr(e?.detail || "Failed to load task");
      }
    }
    fetchIt();
  }, [token, taskId]);

  if (err) return <div className="error">{err}</div>;
  if (!task) return <div>Loading task...</div>;

  return (
    <section className="task-detail-section">
      <header>
        <h2>{task.title}</h2>
        <span className={`task-status status-${task.status}`}>{task.status.replace("_", " ")}</span>
      </header>
      <div><strong>Description:</strong></div>
      <div>{task.description || <em>No description given</em>}</div>
      <div><strong>Created:</strong> {new Date(task.created_at).toLocaleString()}</div>
      <div><strong>Updated:</strong> {new Date(task.updated_at).toLocaleString()}</div>
      <div className="task-detail-actions">
        <button className="btn btn-secondary" onClick={() => nav(`/tasks/${task.id}/edit`)}>Edit</button>
        <button className="btn btn-accent" onClick={() => nav("/tasks")}>Back to List</button>
      </div>
    </section>
  );
}
