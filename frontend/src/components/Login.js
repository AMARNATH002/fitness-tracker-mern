import React, { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    setLoading(true);
    setStatusMsg("⏳ Connecting to server... Please wait (may take ~30s on first load)");

    try {
      const res = await api.post("/users/login", formData);

      if (!res.data || !res.data.user || !res.data.token) {
        throw new Error("Invalid response from server");
      }

      setStatusMsg("✅ Login successful! Redirecting...");

      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      sessionStorage.setItem("token", res.data.token);

      setTimeout(() => {
        alert("Login successful! Welcome back! 💪");

        const next =
          res.data.user?.accountRole === "Admin"
            ? "/admin"
            : res.data.user?.fitnessLevel
            ? "/challenges"
            : "/role";

        window.location.href = next;
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      setStatusMsg("");
      const errorMessage = error.response?.data?.error || error.message || "Login failed. Please try again.";
      alert(errorMessage);
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
          <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>🔥</span>
          <h2 style={{ margin: 0, fontSize: "1.8rem" }}>WELCOME BACK</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
                LOGGING IN...
              </>
            ) : (
              "GET BACK TO TRAINING"
            )}
          </button>
        </form>

        <div style={{ marginTop: "12px", textAlign: "center" }}>
          <Link to="/signup" className="auth-secondary-btn">
            Go to Signup
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

export default Login;
