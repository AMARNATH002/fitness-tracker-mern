import React, { useEffect, useState } from "react";
import api from "../api";
import "./UserList.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('Please login to view the community');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    api.get("/users/community")
      .then((res) => {
        const data = res.data;
        console.log('Fetched users:', data);
        if (Array.isArray(data)) {
          setUsers(data);
          setError(null);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError('Failed to load community data');
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getWorkoutCount = (user) => {
    return user.workouts ? user.workouts.length : 0;
  };

  const getCompletedWorkouts = (user) => {
    return user.workouts ? user.workouts.filter(w => w.completed).length : 0;
  };

  if (loading) {
    return (
      <div className="userlist-container">
        <h2>🏆 Fitness Community</h2>
        <p>Loading community data...</p>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '24px' }}>⏳</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="userlist-container">
        <h2>🏆 Fitness Community</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="userlist-container">
      <h2>🏆 Fitness Community</h2>
      <p>See how our community is crushing their fitness goals!</p>
      
      {users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No community members yet</h3>
          <p>Be the first to join our fitness community!</p>
        </div>
      ) : (
        <div className="user-cards">
          {users.map((user) => (
          <div key={user._id} className="user-card">
            <div className="user-header">
              <h3>{user.name}</h3>
              <span className="user-level">{user.fitnessLevel || user.role || 'Beginner'}</span>
            </div>
            
            <div className="user-stats">
              <p>🔥 Total Workouts: <span>{getWorkoutCount(user)}</span></p>
              <p>✅ Completed: <span>{getCompletedWorkouts(user)}</span></p>
              <p>📊 Success Rate: <span>{getWorkoutCount(user) > 0 ? Math.round((getCompletedWorkouts(user) / getWorkoutCount(user)) * 100) : 0}%</span></p>
            </div>
            
            <p className="date">📅 Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            
            {user.workouts && user.workouts.length > 0 && (
              <div className="recent-workouts">
                <h4>Recent Workouts:</h4>
                <ul>
                  {user.workouts.slice(-3).map((workout, index) => (
                    <li key={index} className={workout.completed ? 'completed' : 'pending'}>
                      {workout.exercise} - {workout.sets}×{workout.reps} {workout.completed ? '✅' : '⏳'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          ))}
        </div>
      )}
      
      {/* Competitions / Community Feed */}
      <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '2px solid #333' }}>
        <h2 style={{ color: '#fff' }}>🏆 Participants / Competitions</h2>
        <p style={{ color: '#bbb' }}>Check out what the community is talking about.</p>
        <ReadOnlyCompetitionFeed />
      </div>

    </div>
  );
}

function ReadOnlyCompetitionFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = () => {
      setPosts(JSON.parse(localStorage.getItem('competitions') || '[]'));
    };
    loadPosts();
    window.addEventListener('storage', loadPosts);
    return () => window.removeEventListener('storage', loadPosts);
  }, []);

  if (posts.length === 0) {
    return <p style={{ color: '#888' }}>No competitions posted yet. Head to your profile to post one!</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {posts.map(post => (
        <div key={post.id} style={{ background: '#222', padding: '15px', borderRadius: '8px', color: '#fff', border: '1px solid #444' }}>
          <div style={{ fontWeight: 'bold', color: '#03a9f4' }}>{post.author}</div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>{new Date(post.date).toLocaleDateString()}</div>
          <p style={{ margin: '0 0 10px 0' }}>{post.content}</p>
          
          {post.replies && post.replies.length > 0 && (
            <div style={{ marginLeft: '20px', paddingLeft: '10px', borderLeft: '3px solid #555' }}>
              {post.replies.map(reply => (
                <div key={reply.id} style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#bbdefb' }}>{reply.author}: </span>
                  <span style={{ fontSize: '0.9rem', color: '#ddd' }}>{reply.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserList;
