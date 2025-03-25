import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileAccordion from "./myProfile";
import "../css/style.css";
import "../css/login.css";
import "../css/table.css";
import { CheckCircle, Circle, Trash, Edit } from "lucide-react";

export default function TodoDashboard() {
  const [filter, setFilter] = useState("ALL");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    let isMounted = true;
    if (!token || !userId) {
      navigate("/");
      return;
      }
    isMounted = false;
    fetchUserDetails();
    fetchTasks();
  }, [navigate]);

  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem("id"); // Ensure this is correct
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setUserName(response.data.fullName);
      setUserEmail(response.data.email);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const response = await axios.get(`http://localhost:5000/api/tasks/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const addTask = async () => {
    if (!newTask.trim() || !userId) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        { text: newTask, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) => [...prev, res.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) => prev.map((task) => (task._id === id ? res.data : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEditing = (task) => {
    setEditTask(task._id);
    setEditText(task.text);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) => prev.map((task) => (task._id === id ? res.data : task)));
      setEditTask(null);
      setEditText("");
    } catch (error) {
      console.error("Error saving task edit:", error);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "ACTIVE" ? !task.completed : filter === "COMPLETED" ? task.completed : true
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar" >
        <div className="profile-section">
          <h2 className="username">{ userName || "User"}</h2>
          <p className="email">{userEmail || "user@example.com"}</p>
        </div>
        <div className="task-summary">
           <table className="task-table">
            <tbody>
              <tr>
                <td><strong>Total tasks</strong></td>
                <td>{tasks.length}</td>
              </tr>
              <tr>
                <td><strong>Active tasks</strong></td>
                <td>{tasks.filter((task) => !task.completed).length}</td>
              </tr>
              <tr>
                <td><strong>Completed tasks</strong></td>
                <td>{tasks.filter((task) => task.completed).length}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ProfileAccordion-container">
        <ProfileAccordion profile={{ name: userName, email: userEmail }}/>
        </div>
        <div className="logout-container">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="main-content">
        <div className="task-card">
          <h2 className="task-title">Work</h2>
          <div className="task-filters">
            {["ALL", "ACTIVE", "COMPLETED"].map((type) => (
              <button
                key={type}
                className={`filter ${filter === type ? "active" : ""}`}
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="add-task-container">
            <input
              type="text"
              placeholder="Enter new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="task-input"
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button className="new-task-btn" onClick={addTask}>Add Task</button>
          </div>

          {loadingTasks ? (
            <p>Loading tasks...</p>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <div key={task._id} className={`task-item ${task.completed ? "completed" : ""}`}>
                  <div className="task-info">
                    {task.completed ? (
                      <CheckCircle className="check-icon completed" onClick={() => toggleComplete(task._id, task.completed)} />
                    ) : (
                      <Circle className="check-icon" onClick={() => toggleComplete(task._id, task.completed)} />
                    )}
                    {editTask === task._id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => saveEdit(task._id)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(task._id)}
                        autoFocus
                      />
                    ) : (
                      <p className="task-text">{task.text}</p>
                    )}
                    <Edit className="edit-icon" onClick={() => startEditing(task)} />
                    <Trash className="delete-icon" onClick={() => deleteTask(task._id)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
