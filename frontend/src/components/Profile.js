import React, { useState, useEffect, useCallback } from "react";
import api from "../api";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [challengeProgress, setChallengeProgress] = useState({
    currentDay: 1,
    totalDays: 30,
    completedWorkouts: 0,
    streak: 0,
  });
  
  // New features state
  const [excuse, setExcuse] = useState("");
  const [destroyerMessage, setDestroyerMessage] = useState("");

  const destroyExcuse = () => {
    if (!excuse.trim()) return;
    const messages = [
      "No excuses. 15 minutes is 1% of your day. Get up! 👊",
      "Excuses don't burn calories. Sweat does! 💦",
      "Your body can stand almost anything. It's your mind you have to convince. 🧠",
      "Don't stop when you're tired. Stop when you're DONE. 🛑",
      "Someone busier than you is working out right now. What's stopping you? ⏰"
    ];
    setDestroyerMessage(messages[Math.floor(Math.random() * messages.length)]);
    setExcuse("");
  };

  const getPlantStage = (streak) => {
    if (streak === 0) return { emoji: "🌱", text: "Seed (Time to start watering it with sweat!)" };
    if (streak <= 3) return { emoji: "🌿", text: "Sprout (Keep going, it's growing!)" };
    if (streak <= 6) return { emoji: "🪴", text: "Healthy Plant (Looking strong!)" };
    return { emoji: "🌳", text: "Mighty Tree (Unstoppable streak!)" };
  };

  const calculateStreak = (workouts) => {
    if (!workouts || workouts.length === 0) return 0;

    const completedWorkouts = workouts.filter((w) => w.completed);
    if (completedWorkouts.length === 0) return 0;

    // Sort by date (newest first)
    const sortedWorkouts = completedWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date));

    let streak = 0;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if there's a workout today or yesterday to start the streak
    const hasRecentWorkout = sortedWorkouts.some(w => {
      const workoutDate = new Date(w.date);
      return workoutDate.toDateString() === today.toDateString() ||
             workoutDate.toDateString() === yesterday.toDateString();
    });

    if (!hasRecentWorkout) return 0;

    // Count consecutive days
    let currentDate = new Date(today);
    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].date);
      if (workoutDate.toDateString() === currentDate.toDateString() ||
          workoutDate.toDateString() === new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const getTotalDaysByLevel = (level) => {
    switch (level) {
      case "Beginner": return 30;
      case "Intermediate": return 45;
      case "Master": return 60;
      default: return 30;
    }
  };

  const calculateCompletedDays = (completedWorkouts, role) => {
    // Simple calculation based on number of completed workouts
    return completedWorkouts.length;
  };

  const loadUserProgress = useCallback(async (userId, role) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await api.get(
        `/users/${userId}/workouts`
      );
      const workouts = response.data || [];
      const completedWorkouts = workouts.filter((w) => w.completed === true);

      // Calculate actual days completed based on workout phases
      const totalDays = getTotalDaysByLevel(role);
      const completedDays = calculateCompletedDays(completedWorkouts, role);
      const currentDay = Math.min(completedDays + 1, totalDays);

      setChallengeProgress({
        currentDay: currentDay,
        totalDays: totalDays,
        completedWorkouts: completedWorkouts.length,
        streak: calculateStreak(workouts),
      });
    } catch (error) {
      console.error("Error loading user progress:", error);
    }
  }, []);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      if (userObj.accountRole === 'Admin') {
        window.location.href = '/admin';
        return;
      }

      setChallengeProgress((prev) => ({
        ...prev,
        totalDays: getTotalDaysByLevel(userObj.fitnessLevel || userObj.role),
      }));

      loadUserProgress(userObj._id, userObj.fitnessLevel || userObj.role);
    }
  }, [loadUserProgress]);

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Please login to view your profile</h2>
        </div>
      </div>
    );
  }

  const getProgressPercentage = () => {
    return (challengeProgress.completedWorkouts / challengeProgress.totalDays) * 100;
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>👤 My Profile</h2>
          <div className="user-avatar">💪</div>
        </div>

        {/* Personal Information */}
        <div className="user-info">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item"><label>Name:</label><span>{user.name}</span></div>
            <div className="info-item"><label>Email:</label><span>{user.email}</span></div>
            <div className="info-item"><label>Fitness Level:</label><span className="level-badge">{user.fitnessLevel || user.role || "Beginner"}</span></div>
            <div className="info-item"><label>Member Since:</label><span>{new Date(user.createdAt).toLocaleDateString()}</span></div>
          </div>
        </div>

        {/* Challenge Progress */}
        <div className="challenge-progress">
          <h3>🏆 Challenge Progress</h3>
          <div className="progress-stats">
            <div className="stat-card"><div className="stat-number">{challengeProgress.currentDay}</div><div className="stat-label">Current Day</div></div>
            <div className="stat-card"><div className="stat-number">{challengeProgress.totalDays}</div><div className="stat-label">Total Days</div></div>
            <div className="stat-card"><div className="stat-number">{challengeProgress.completedWorkouts}</div><div className="stat-label">Completed</div></div>
            <div className="stat-card"><div className="stat-number">{challengeProgress.streak}</div><div className="stat-label">Day Streak</div></div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar-container">
            <div className="progress-label">Progress: {challengeProgress.completedWorkouts} / {challengeProgress.totalDays} days</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${getProgressPercentage()}%` }}></div>
            </div>
            <div className="progress-percentage">{Math.round(getProgressPercentage())}% Complete</div>
          </div>

          {/* Calendar */}
          <div className="calendar-progress">
            <h4>Day-by-Day Progress</h4>
            <div className="calendar-grid">
              {[...Array(challengeProgress.totalDays)].map((_, i) => {
                let dayClass = "calendar-day";
                if (i < challengeProgress.completedWorkouts) dayClass += " completed";
                else if (i === challengeProgress.completedWorkouts) dayClass += " current";
                return <div key={i} className={dayClass}>{i + 1}</div>;
              })}
            </div>
            <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
              Each workout completion = 1 day progress
            </p>
          </div>

          {/* Challenge Info */}
          <div className="challenge-info">
            <h4>Challenge Details</h4>
            <p><strong>Level:</strong> {user.fitnessLevel || user.role || "Beginner"}<br />
               <strong>Duration:</strong> {getTotalDaysByLevel(user.fitnessLevel || user.role)} days<br />
               <strong>Goal:</strong> Complete daily workouts to build fitness habits</p>
          </div>
        </div>

        {/* Unique Feature 1: Fitness Plant */}
        <div className="fitness-plant-section">
          <h3>🌱 Your Fitness Buddy</h3>
          <p className="plant-desc">Your plant grows when you maintain your workout streak!</p>
          <div className="plant-display">
            <div className="plant-emoji">{getPlantStage(challengeProgress.streak).emoji}</div>
            <div className="plant-text">{getPlantStage(challengeProgress.streak).text}</div>
          </div>
        </div>

        {/* Unique Feature 2: Excuse Destroyer */}
        <div className="excuse-destroyer">
          <h3>🔥 Excuse Destroyer</h3>
          <p>Feeling lazy? Type your excuse below.</p>
          <div className="excuse-input-group">
            <input 
              type="text" 
              value={excuse} 
              onChange={(e) => setExcuse(e.target.value)} 
              placeholder="e.g., I'm too tired today..."
              onKeyPress={(e) => e.key === 'Enter' && destroyExcuse()}
            />
            <button onClick={destroyExcuse} className="btn-destroy">Destroy Excuse</button>
          </div>
          {destroyerMessage && (
            <div className="destroyer-message animate-pop">
              {destroyerMessage}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="achievements">
          <h3>🏅 Achievements</h3>
          <div className="achievement-grid">
            {challengeProgress.completedWorkouts >= 1 && <div className="achievement-badge">🥇 First Workout</div>}
            {challengeProgress.completedWorkouts >= 7 && <div className="achievement-badge">🔥 Week Warrior</div>}
            {challengeProgress.completedWorkouts >= 15 && <div className="achievement-badge">💪 Halfway Hero</div>}
            {challengeProgress.completedWorkouts >= 30 && <div className="achievement-badge">🏆 Challenge Champion</div>}
            {challengeProgress.streak >= 5 && <div className="achievement-badge">⚡ Streak Master</div>}
          </div>
        </div>
        
        {/* Competitions / Community Section */}
        <div className="competitions-section" style={{ marginTop: '30px', padding: '20px', background: '#f5f7fa', borderRadius: '12px' }}>
          <h3>🏆 Community Competitions</h3>
          <p>Ask questions, post about competitions, and reply to others.</p>
          
          <div className="competition-input-group" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="text" 
              id="comp-input"
              placeholder="Post about an upcoming competition..."
              style={{ flexGrow: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <button 
              className="btn btn-primary"
              onClick={() => {
                const input = document.getElementById('comp-input');
                if (!input.value.trim()) return;
                
                const newPost = {
                  id: Date.now().toString(),
                  author: user.name,
                  content: input.value,
                  date: new Date().toISOString(),
                  replies: []
                };
                
                const existingPosts = JSON.parse(localStorage.getItem('competitions') || '[]');
                localStorage.setItem('competitions', JSON.stringify([newPost, ...existingPosts]));
                input.value = '';
                // force re-render by dispatching an event
                window.dispatchEvent(new Event('storage'));
              }}
            >
              Post
            </button>
          </div>
          
          <div className="competitions-feed">
            <CompetitionFeed />
          </div>
        </div>

      </div>
    </div>
  );
}

// Sub-component to manage competition posts
function CompetitionFeed() {
  const [posts, setPosts] = useState([]);

  const loadPosts = () => {
    setPosts(JSON.parse(localStorage.getItem('competitions') || '[]'));
  };

  useEffect(() => {
    loadPosts();
    window.addEventListener('storage', loadPosts);
    return () => window.removeEventListener('storage', loadPosts);
  }, []);

  const addReply = (postId, replyContent) => {
    if (!replyContent.trim()) return;
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const authorName = userData ? userData.name : 'Unknown';
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, {
            id: Date.now().toString(),
            author: authorName,
            content: replyContent,
            date: new Date().toISOString()
          }]
        };
      }
      return post;
    });
    
    localStorage.setItem('competitions', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {posts.length === 0 ? <p>No posts yet. Be the first to start a discussion!</p> : null}
      {posts.map(post => (
        <div key={post.id} style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontWeight: 'bold', color: '#1a237e' }}>{post.author}</div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>{new Date(post.date).toLocaleDateString()}</div>
          <p style={{ margin: '0 0 10px 0' }}>{post.content}</p>
          
          {/* Replies */}
          {post.replies && post.replies.length > 0 && (
            <div style={{ marginLeft: '20px', paddingLeft: '10px', borderLeft: '3px solid #eee', marginBottom: '10px' }}>
              {post.replies.map(reply => (
                <div key={reply.id} style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{reply.author}: </span>
                  <span style={{ fontSize: '0.9rem' }}>{reply.content}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Reply Input */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <input 
              type="text" 
              id={`reply-${post.id}`}
              placeholder="Write a reply..."
              style={{ flexGrow: 1, padding: '6px 10px', borderRadius: '20px', border: '1px solid #ddd', fontSize: '0.9rem' }}
            />
            <button 
              style={{ padding: '6px 12px', background: '#e3f2fd', color: '#1565c0', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600' }}
              onClick={() => {
                const input = document.getElementById(`reply-${post.id}`);
                addReply(post.id, input.value);
                input.value = '';
              }}
            >
              Reply
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Profile;
