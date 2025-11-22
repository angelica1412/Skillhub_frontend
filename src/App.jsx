import { useState } from "react";
import ParticipantManager from "./components/ParticipantManager";
import ClassManager from "./components/ClassManager";
import EnrollmentManager from "./components/EnrollmentManager";

function App() {
  const [activeTab, setActiveTab] = useState("participants");

  const renderManager = () => {
    switch (activeTab) {
      case "classes":
        return (
          <div style={{ padding: "20px" }}>
            <ClassManager />
          </div>
        );
      case "enrollments":
        return (
          <div style={{ padding: "20px" }}>
            <EnrollmentManager />
          </div>
        );
      case "participants":
      default:
        return (
          <div style={{ padding: "20px" }}>
            <ParticipantManager />
          </div>
        );
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h1>🎓 Skill Hub Dashboard</h1>

      {/* Navigasi Tab Sederhana */}
      <div style={{ marginBottom: "20px", borderBottom: "2px solid #eee" }}>
        <button
          onClick={() => setActiveTab("participants")}
          style={{
            padding: "10px",
            marginRight: "5px",
            border:
              activeTab === "participants"
                ? "2px solid blue"
                : "1px solid #ccc",
          }}
        >
         Participant Management
        </button>
        <button
          onClick={() => setActiveTab("classes")}
          style={{
            padding: "10px",
            marginRight: "5px",
            border:
              activeTab === "classes" ? "2px solid blue" : "1px solid #ccc",
          }}
        >
          Class Management
        </button>
        <button
          onClick={() => setActiveTab("enrollments")}
          style={{
            padding: "10px",
            border:
              activeTab === "enrollments" ? "2px solid blue" : "1px solid #ccc",
          }}
        >
         Enrollment Management
        </button>
      </div>

      {renderManager()}
    </div>
  );
}

export default App;
