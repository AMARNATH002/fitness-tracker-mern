import React, { useState, useEffect } from "react";
import api from "../api";
import "./Goals.css";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newGoal, setNewGoal] = useState({ title: "", target: "", unit: "kg" });
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const UNITS = ["kg", "lbs", "reps", "mins", "km", "miles", "calories"];

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchGoals(parsedUser._id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchGoals = async (userId) => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${userId}/goals`);
      setGoals(res.data || []);
    } catch (err) {
      console.error("Failed to fetch goals:", err);
      setError("Could not load goals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.title.trim() || !newGoal.target) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/users/${user._id}/goals`, {
        title: newGoal.title,
        target: Number(newGoal.target),
        unit: newGoal.unit,
      });
      setGoals(res.data?.goals || [...goals, res.data]);
      setNewGoal({ title: "", target: "", unit: "kg" });
    } catch (err) {
      console.error("Failed to add goal:", err);
      alert("Failed to add goal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleGoal = async (goalId, currentStatus) => {
    try {
      const res = await api.put(`/users/${user._id}/goals/${goalId}`, {
        completed: !currentStatus,
      });
      setGoals(res.data?.goals || goals.map(g => g._id === goalId ? { ...g, completed: !currentStatus } : g));
    } catch (err) {
      console.error("Failed to update goal:", err);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await api.delete(`/users/${user._id}/goals/${goalId}`);
      setGoals(goals.filter(g => g._id !== goalId));
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progress = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  if (!user) {
    return (
      <div className="goals-page">
        <div className="goals-login-prompt">
          <div className="lock-icon">🔒</div>
          <h2>Login Required</h2>
          <p>Please login to track your fitness goals.</p>
          <a href="/login" className="goals-login-btn">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="goals-page">
      {/* Header */}
      <div className="goals-header">
        <h1>🎯 My Fitness Goals</h1>
        <p>Set targets, stay consistent, and crush every goal!</p>
      </div>

      {/* Progress Summary */}
      {goals.length > 0 && (
        <div className="goals-progress-card">
          <div className="progress-stats">
            <span className="progress-label">Overall Progress</span>
            <span className="progress-fraction">{completedCount}/{goals.length} goals completed</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-percent">{progress}%</span>
        </div>
      )}

      {/* Add Goal Form */}
      <div className="goals-form-card">
        <h2>➕ Add New Goal</h2>
        <form className="goals-form" onSubmit={handleAddGoal}>
          <input
            type="text"
            className="goals-input"
            placeholder="e.g. Bench Press, Run 5K, Lose weight..."
            value={newGoal.title}
            onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
            required
          />
          <div className="goals-target-row">
            <input
              type="number"
              className="goals-input goals-number-input"
              placeholder="Target"
              min="0"
              value={newGoal.target}
              onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
              required
            />
            <select
              className="goals-select"
              value={newGoal.unit}
              onChange={e => setNewGoal({ ...newGoal, unit: e.target.value })}
            >
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <button
              type="submit"
              className="goals-add-btn"
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add Goal"}
            </button>
          </div>
        </form>
      </div>

      {/* Goals List */}
      <div className="goals-list">
        {loading ? (
          <div className="goals-loading">
            <div className="goals-spinner"></div>
            <p>Loading your goals...</p>
          </div>
        ) : error ? (
          <div className="goals-error">
            <p>{error}</p>
            <button onClick={() => fetchGoals(user._id)} className="goals-retry-btn">Retry</button>
          </div>
        ) : goals.length === 0 ? (
          <div className="goals-empty">
            <div className="empty-icon">🎯</div>
            <h3>No goals yet!</h3>
            <p>Set your first fitness goal above and start crushing it! 💪</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div
              key={goal._id}
              className={`goal-card ${goal.completed ? "goal-card--done" : ""}`}
            >
              <div className="goal-card-left">
                <button
                  className={`goal-check-btn ${goal.completed ? "checked" : ""}`}
                  onClick={() => handleToggleGoal(goal._id, goal.completed)}
                  title={goal.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {goal.completed ? "✅" : "⬜"}
                </button>
                <div className="goal-info">
                  <h3 className={`goal-title ${goal.completed ? "goal-title--done" : ""}`}>
                    {goal.title}
                  </h3>
                  <span className="goal-target">
                    🎯 Target: <strong>{goal.target} {goal.unit}</strong>
                  </span>
                  {goal.completed && (
                    <span className="goal-badge">✨ Completed!</span>
                  )}
                </div>
              </div>
              <button
                className="goal-delete-btn"
                onClick={() => handleDeleteGoal(goal._id)}
                title="Delete goal"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Goals;
