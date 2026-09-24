import React, { useState, useEffect } from "react";
import api from "../api";
import "./Workouts.css";

// Import images
import burpees from "../assets/images/burpees.jpg";
import crossArmPushup from "../assets/images/Cross-arm push-up.jpeg";
import dumbbellReverseWristCurl from "../assets/images/Dumbbell reverse wrist curl over bench.jpeg";
import hyghtDumbbellFly from "../assets/images/Hyght dumbbell fly.jpeg";
import inclineEZBarTriceps from "../assets/images/Incline EZ bar triceps exe.jpeg";
import kettlebellLateralRaise from "../assets/images/Kettlebell lateral raise.jpeg";
import lunges from "../assets/images/lunges.jpg";
import olympicsTricepsBar from "../assets/images/Olympics triceps bar overhead triceps exe.jpeg";
import oneArmCrossBodyTriceps from "../assets/images/one-arm cross-body dumbbell triceps.jpeg";
import plank from "../assets/images/plank.jpg";
import proneInclineDumbbellFrontRaise from "../assets/images/Prone incline dumbbell front raise.jpeg";
import pullup from "../assets/images/pullup.jpg";
import pushup from "../assets/images/pushup.jpg";
import rearLunge from "../assets/images/Rear lunge.jpeg";
import reverseGripBenchPress from "../assets/images/Reverse-grip dumbbell bench press.jpeg";
import sealPushUp from "../assets/images/Seal push-up.jpeg";
import sprinterLunge from "../assets/images/Sprinter lunge.jpeg";
import squat from "../assets/images/squat.jpg";
import standingOverheadTriceps from "../assets/images/Standing overhead barbell triceps exe.jpeg";
import twoArmSupinatedCurl from "../assets/images/Two-arm supinated dumbbell curl.jpeg";

const workoutsData = [
  { name: "Push Ups", image: pushup, sets: 3, reps: 10 },
  { name: "Squats", image: squat, sets: 3, reps: 15 },
  { name: "Plank", image: plank, sets: 3, reps: 30 },
  { name: "Burpees", image: burpees, sets: 3, reps: 10 },
  { name: "Pull Ups", image: pullup, sets: 3, reps: 8 },
  { name: "Lunges", image: lunges, sets: 3, reps: 12 },
  { name: "Cross-arm Push Up", image: crossArmPushup, sets: 3, reps: 10 },
  { name: "Dumbbell Reverse Wrist Curl", image: dumbbellReverseWristCurl, sets: 3, reps: 12 },
  { name: "Hyght Dumbbell Fly", image: hyghtDumbbellFly, sets: 3, reps: 12 },
  { name: "Incline EZ Bar Triceps", image: inclineEZBarTriceps, sets: 3, reps: 10 },
  { name: "Kettlebell Lateral Raise", image: kettlebellLateralRaise, sets: 3, reps: 12 },
  { name: "Olympics Triceps Bar", image: olympicsTricepsBar, sets: 3, reps: 10 },
  { name: "One-arm Cross-body Triceps", image: oneArmCrossBodyTriceps, sets: 3, reps: 10 },
  { name: "Prone Incline Front Raise", image: proneInclineDumbbellFrontRaise, sets: 3, reps: 12 },
  { name: "Rear Lunge", image: rearLunge, sets: 3, reps: 12 },
  { name: "Reverse-grip Bench Press", image: reverseGripBenchPress, sets: 3, reps: 10 },
  { name: "Seal Push Up", image: sealPushUp, sets: 3, reps: 12 },
  { name: "Sprinter Lunge", image: sprinterLunge, sets: 3, reps: 12 },
  { name: "Standing Overhead Triceps", image: standingOverheadTriceps, sets: 3, reps: 12 },
  { name: "Two-arm Supinated Curl", image: twoArmSupinatedCurl, sets: 3, reps: 12 },
];

function Workouts() {
  // Track completed state per card index
  const [completed, setCompleted] = useState({});
  // Track which cards are currently saving (to show loading state)
  const [saving, setSaving] = useState({});
  const [user, setUser] = useState(null);

  // On mount: load user + fetch their completed workouts from DB
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (!userData) return;
    const userObj = JSON.parse(userData);
    setUser(userObj);

    // Fetch existing workouts from DB to restore completed state
    api.get(`/users/${userObj._id}/workouts`)
      .then((res) => {
        const dbWorkouts = res.data || [];
        // Find which of our static workouts have been completed today
        const today = new Date().toDateString();
        const completedTodayNames = new Set(
          dbWorkouts
            .filter(w => w.completed && new Date(w.date).toDateString() === today)
            .map(w => w.exercise)
        );

        // Mark matching cards as done
        const restoredState = {};
        workoutsData.forEach((workout, index) => {
          if (completedTodayNames.has(workout.name)) {
            restoredState[index] = true;
          }
        });
        setCompleted(restoredState);
      })
      .catch((err) => {
        console.error("Could not load workout history:", err);
      });
  }, []);

  const handleComplete = async (index) => {
    const workout = workoutsData[index];

    // Optimistically update UI immediately
    setCompleted(prev => ({ ...prev, [index]: true }));
    setSaving(prev => ({ ...prev, [index]: true }));

    if (user) {
      try {
        // Step 1: Add the workout to DB
        const addRes = await api.post(`/users/${user._id}/workouts`, {
          exercise: workout.name,
          sets: workout.sets,
          reps: workout.reps,
          completed: true,
          date: new Date().toISOString()
        });

        // Step 2: Mark it completed (PUT) using the new workout's _id
        const newUser = addRes.data;
        const addedWorkout = newUser.workouts
          ? newUser.workouts[newUser.workouts.length - 1]
          : null;

        if (addedWorkout && addedWorkout._id) {
          await api.put(`/users/${user._id}/workouts/${addedWorkout._id}`);
        }

        // Step 3: Update streak
        await api.post(`/users/${user._id}/update-streak`);

      } catch (err) {
        console.error("Failed to save workout to DB:", err);
        // Don't revert UI — local state is still useful even if DB save fails
      }
    }

    setSaving(prev => ({ ...prev, [index]: false }));
  };

  const handleReset = (index) => {
    setCompleted(prev => ({ ...prev, [index]: false }));
    // Note: We don't delete from DB as completed workouts are part of history
  };

  return (
    <div className="workouts-page">
      <div className="workouts-header">
        <h1>🏋️‍♂️ All Workouts</h1>
        <p>Follow these exercises to build your strength and endurance.</p>
        {!user && (
          <p style={{ color: '#ff9800', fontSize: '0.9rem', marginTop: '8px' }}>
            ⚠️ Login to save your workout progress across sessions!
          </p>
        )}
      </div>

      <div className="workouts-grid">
        {workoutsData.map((workout, index) => {
          const isDone = !!completed[index];
          const isSaving = !!saving[index];
          return (
            <div
              className={`workout-card ${isDone ? 'workout-card--done' : ''}`}
              key={index}
            >
              <div className="workout-image-container">
                <img src={workout.image} alt={workout.name} className="workout-image" />
                {isDone && (
                  <div className="workout-done-overlay">
                    <span>✅ Done!</span>
                  </div>
                )}
              </div>
              <div className="workout-details">
                <h3>{workout.name}</h3>
                <div className="workout-stats">
                  <span className="stat-badge">Sets: {workout.sets}</span>
                  <span className="stat-badge">Reps: {workout.reps}</span>
                </div>
                <div className="workout-card-actions">
                  {!isDone ? (
                    <button
                      className="wk-complete-btn"
                      onClick={() => handleComplete(index)}
                      disabled={isSaving}
                      style={{ opacity: isSaving ? 0.7 : 1, cursor: isSaving ? "not-allowed" : "pointer" }}
                    >
                      {isSaving ? "⏳ Saving..." : "✅ Complete"}
                    </button>
                  ) : (
                    <button
                      className="wk-reset-btn"
                      onClick={() => handleReset(index)}
                    >
                      🔄 Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Workouts;

