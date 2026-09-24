import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    accountRole: "User",
    fitnessLevel: "Beginner"
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "accountRole") {
      if (value === "Admin") {
        setFormData({ ...formData, accountRole: value, fitnessLevel: "" });
      } else {
        setFormData({ ...formData, accountRole: value, fitnessLevel: formData.fitnessLevel || "Beginner" });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    setLoading(true);
    setStatusMsg("⏳ Connecting to server... Please wait (may take ~30s on first load)");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        accountRole: formData.accountRole,
        ...(formData.accountRole === "User" && formData.fitnessLevel
          ? { fitnessLevel: formData.fitnessLevel }
          : {})
      };

      await api.post("/users/signup", payload);

      setStatusMsg("✅ Signup successful! Redirecting...");
      setTimeout(() => {
        alert("Signup successful! Welcome to your fitness journey! 💪");
        navigate("/login");
      }, 500);

    } catch (error) {
      console.error(error);
      setStatusMsg("");
      alert(error.response?.data?.error || "Signup failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px"
          }}
        >
          <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>🏋️‍♂️</span>
          <h2 style={{ margin: 0, fontSize: "1.8rem" }}>JOIN THE CHALLENGE</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Account Role</label>
            <select
              name="accountRole"
              value={formData.accountRole}
              onChange={handleChange}
              className="form-select"
              disabled={loading}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {formData.accountRole === "User" && (
            <div className="form-group">
              <label>Fitness Level</label>
              <select
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
                className="form-select"
                required
                disabled={loading}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Master">Master</option>
              </select>
            </div>
          )}

          {/* Loading status message */}
          {statusMsg && (
            <div style={{
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 152, 0, 0.15)",
              border: "1px solid #ff9800",
              color: "#ff9800",
              fontSize: "0.85rem",
              textAlign: "center",
              marginBottom: "10px",
              fontWeight: "500"
            }}>
              {statusMsg}
            </div>
          )}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            {loading ? (
              <>
                <span style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(0,0,0,0.3)",
                  borderTop: "2px solid #000",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }}></span>
                SIGNING UP...
              </>
            ) : (
              "START YOUR JOURNEY"
            )}
          </button>
        </form>

        <div style={{ marginTop: "12px", textAlign: "center" }}>
          <Link to="/login" className="auth-secondary-btn">
            Go to Login
          </Link>
        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Signup;
