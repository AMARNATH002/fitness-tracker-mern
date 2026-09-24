import React from "react";
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
  { name: "Push Ups", image: pushup },
  { name: "Squats", image: squat },
  { name: "Plank", image: plank },
  { name: "Burpees", image: burpees },
  { name: "Pull Ups", image: pullup },
  { name: "Lunges", image: lunges },
  { name: "Cross-arm Push Up", image: crossArmPushup },
  { name: "Dumbbell Reverse Wrist Curl", image: dumbbellReverseWristCurl },
  { name: "Hyght Dumbbell Fly", image: hyghtDumbbellFly },
  { name: "Incline EZ Bar Triceps", image: inclineEZBarTriceps },
  { name: "Kettlebell Lateral Raise", image: kettlebellLateralRaise },
  { name: "Olympics Triceps Bar", image: olympicsTricepsBar },
  { name: "One-arm Cross-body Triceps", image: oneArmCrossBodyTriceps },
  { name: "Prone Incline Front Raise", image: proneInclineDumbbellFrontRaise },
  { name: "Rear Lunge", image: rearLunge },
  { name: "Reverse-grip Bench Press", image: reverseGripBenchPress },
  { name: "Seal Push Up", image: sealPushUp },
  { name: "Sprinter Lunge", image: sprinterLunge },
  { name: "Standing Overhead Triceps", image: standingOverheadTriceps },
  { name: "Two-arm Supinated Curl", image: twoArmSupinatedCurl }
];

function Workouts() {
  return (
    <div className="workouts-page">
      <div className="workouts-header">
        <h1>🏋️‍♂️ All Workouts</h1>
        <p>Follow these exercises to build your strength and endurance.</p>
      </div>

      <div className="workouts-grid">
        {workoutsData.map((workout, index) => (
          <div className="workout-card" key={index}>
            <div className="workout-image-container">
              <img src={workout.image} alt={workout.name} className="workout-image" />
            </div>
            <div className="workout-details">
              <h3>{workout.name}</h3>
              <div className="workout-stats">
                <span className="stat-badge">Sets: 3</span>
                <span className="stat-badge">Reps: 4</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workouts;
