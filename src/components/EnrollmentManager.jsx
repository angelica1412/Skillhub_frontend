import { useState, useEffect } from "react";
import EnrollmentService from "../services/EnrollmentService";
import ParticipantService from "../services/ParticipantService";
import ClassService from "../services/ClassService";
import "../App.css";

const EnrollmentManager = () => {
  const [participants, setParticipants] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [enrollmentList, setEnrollmentList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [pRes, cRes] = await Promise.all([
        ParticipantService.getAllParticipants(),
        ClassService.getAllClasses(),
      ]);
      setParticipants(pRes.data);
      setClasses(cRes.data);
    };
    fetchData();
  }, []);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedParticipantId || !selectedClassId) {
      return alert("Select Participant and Class to enroll.");
    }

    try {
      await EnrollmentService.enroll({
        ParticipantId: parseInt(selectedParticipantId),
        ClassIds: [parseInt(selectedClassId)],
      });
      alert("Enrollment recorded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to enroll. Participant may already be enrolled in this class.");
    }
  };

  const handleReadClasses = async () => {
    if (!selectedParticipantId) return;
    try {
      const res = await EnrollmentService.getClassesByParticipant(
        selectedParticipantId
      );
      setEnrollmentList(
        res.data.map((cls) => ({
          type: "Class",
          name: cls.class_name,
          date: cls.Enrollment.enrollment_date,
        }))
      );
    } catch (err) {
      alert("Failed to load participant classes.");
    }
  };

  const handleReadParticipants = async () => {
    if (!selectedClassId) return;
    try {
      const res = await EnrollmentService.getParticipantsByClass(
        selectedClassId
      );
      setEnrollmentList(
        res.data.map((p) => ({
          type: "Participant",
          name: p.name,
          date: p.Enrollment.enrollment_date,
        }))
      );
    } catch (err) {
      alert("Failed to load class participants.");
    }
  };

  const handleCancelEnrollment = async () => {
    if (!selectedParticipantId || !selectedClassId) {
      return alert("Select Participant and Class to cancel enrollment.");
    }
    if (!window.confirm("Are you sure you want to cancel this enrollment?")) return;

    try {
      await EnrollmentService.cancelEnrollment({
        ParticipantId: parseInt(selectedParticipantId),
        ClassId: parseInt(selectedClassId),
      });
      alert("Cancellation successful!");
    } catch (err) {
      alert("Failed to cancel enrollment. It might not be found.");
    }
  };

  return (
    <div>
      <h2>Enrollment Management</h2>

      {/* Enrollment & Cancellation Form */}
      <form
        onSubmit={handleEnroll}
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "20px",
        }}
      >
        <h3>Enrollment & Cancellation</h3>
        <select
          onChange={(e) => setSelectedParticipantId(e.target.value)}
          value={selectedParticipantId}
          style={{ padding: "10px" }}
        >
          <option value="">Select Participant</option>
          {participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id}. {p.name}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedClassId(e.target.value)}
          value={selectedClassId}
          style={{ padding: "10px", marginLeft: "10px" }}
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id}. {c.class_name}
            </option>
          ))}
        </select>

        <div style={{ marginTop: "10px" }}>
          <button type="submit" style={{ background: "green", color: "white" }}>
            Enroll (Create)
          </button>
          <button
            type="button"
            onClick={handleCancelEnrollment}
            style={{ marginLeft: "10px", background: "orange" }}
          >
            Cancel (Delete)
          </button>
        </div>
      </form>

      {/* Read Testing Area */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ border: "1px solid #ccc", padding: "15px" }}>
          <h3>Classes Followed by Participant</h3>
          <button onClick={handleReadClasses} disabled={!selectedParticipantId}>
            Show Classes
          </button>
          <p>Participant ID: {selectedParticipantId}</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "15px" }}>
          <h3>Participants in Specific Class</h3>
          <button onClick={handleReadParticipants} disabled={!selectedClassId}>
            Show Participants
          </button>
          <p>Class ID: {selectedClassId}</p>
        </div>
      </div>

      {/* Read Results */}
      <h3 style={{ marginTop: "20px" }}>Read Results</h3>
      <table className="data-table" border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name/Title</th>
            <th>Enrollment Date</th>
          </tr>
        </thead>
        <tbody>
          {enrollmentList.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{item.name}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnrollmentManager;