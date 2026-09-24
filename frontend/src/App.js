import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserList from "./components/UserList";
import AdminDashboard from "./components/AdminDashboard";
import Signup from "./components/Signup";
import Login from "./components/Login";
import RoleSelect from "./components/RoleSelect";
import Challenges from "./components/Challenges";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Contact from "./components/Contact";
import Goals from "./components/Goals";
import Workouts from "./components/Workouts";
import MusicPlayer from "./components/MusicPlayer";
import "./App.css";

import ronnieImage from './assets/images/ronnie.png';

function Home() {
  return (
    <div className="home-page" style={{ 
      backgroundImage: `url(${ronnieImage})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundAttachment: 'fixed',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 1
      }}></div>

      <div className="welcome-section" style={{ zIndex: 2, textAlign: 'center', color: '#fff', maxWidth: '800px', padding: '40px' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 20px', color: '#ff9800' }}>
          YEAH BUDDY!
        </h1>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 20px', textTransform: 'uppercase' }}>
          Welcome to <span className="highlight" style={{ color: '#03a9f4' }}>GHOST Fitness</span>
        </h2>
        <p className="tagline" style={{ fontSize: '1.2rem', marginBottom: '30px', fontWeight: '500' }}>
          Everybody wants to be a bodybuilder, but nobody wants to lift no heavy-ass weights! Track your workouts and build your legacy.
        </p>

        <div className="auth-buttons" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/signup" className="btn btn-signup" style={{ padding: '15px 40px', fontSize: '1.1rem', backgroundColor: '#ff9800', color: '#000', fontWeight: 'bold' }}>START TRAINING</Link>
          <Link to="/login" className="btn btn-login" style={{ padding: '15px 40px', fontSize: '1.1rem', backgroundColor: 'transparent', border: '2px solid #ff9800', color: '#ff9800', fontWeight: 'bold' }}>LOGIN</Link>
        </div>
      </div>
    </div>
  );
}


function About() {
  return (
    <div className="simple-page">
      <div className="page-container">
        <h1 className="page-title">About Us</h1>
        <p className="page-description">
          We are dedicated to helping you achieve your body and mind through the power of fitness.
        </p>
        <div className="simple-content">
          <p>The Fitness Challenge Tracker is your personal companion for building discipline, tracking workouts, and staying motivated with challenges.</p>
        </div>
      </div>
    </div>
  );
}


function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const initializeApp = () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        const token = sessionStorage.getItem("token");
        
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser._id) {
            setUser(parsedUser);
            setIsLoggedIn(true);
          } else {
            // Invalid user data, clear storage
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to prevent flash
    setTimeout(initializeApp, 100);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white'
      }}>
        <div>Loading... 💪</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {/* Simple Navbar */}
        <nav className="simple-navbar">
          <div className="navbar-content">
            <div className="navbar-left">
              <span className="yeah-buddy-text" style={{marginRight: '15px', color: '#ff9800'}}>YEAH BUDDY 🏋🎧</span>
              <h1 className="navbar-title"> GHOST FITNESS CHALLENGE TRACKER</h1>
            </div>
            
            <div className="navbar-right">
              <Link to="/" className="nav-link">HOME</Link>
              <Link to="/about" className="nav-link">ABOUT US</Link>
              <Link to="/workouts" className="nav-link">WORKOUTS</Link>
              <Link to="/users" className="nav-link">BLOG</Link>
              <Link to="/profile" className="nav-link">MY PROFILE</Link>
              <Link to="/goals" className="nav-link">GOALS</Link>
              <Link to="/contact" className="nav-link">CONTACT</Link>
              {!isLoggedIn && (
                <Link to="/login" className="nav-link">SIGNUP / LOGIN</Link>
              )}
              {isLoggedIn && (
                <Link to="/login" onClick={handleLogout} className="nav-link">LOGOUT</Link>
              )}
              <span className="yeah-buddy-text" style={{marginLeft: '15px', color: '#ff9800'}}>LIGHT WEIGHT⛓️ 💪🏼</span>
            </div>
          </div>
        </nav>

        {/* Sidebar removed as per user request */}

        {/* Routes */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/role" element={<RoleSelect />} />
            <Route path="/challenges" element={
              <ProtectedRoute>
                {user?.accountRole === 'Admin' ? <Home /> : <Challenges />}
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/goals" element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>💪🏻Be Consistent & Strong -🏋️‍♂️- 👊🏻- GHOST Fitness Tracker 💪🏻</p>
        </footer>
        <MusicPlayer />
      </div>
    </Router>
  );
}

export default App;
