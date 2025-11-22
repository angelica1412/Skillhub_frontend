import { useState, useEffect } from "react";
import ParticipantService from "../services/ParticipantService";
import "../App.css";

const initialFormState = { name: "", email: "", phone_number: "" };

const ParticipantManager = () => {
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await ParticipantService.getAllParticipants();
      setParticipants(response.data);
    } catch (err) {
      console.error("Error fetching participants:", err);
      alert(
        "Failed to load participant data. Make sure the backend is running & CORS is enabled."
      );
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await ParticipantService.updateParticipant(editingId, formData);
        alert("Participant updated successfully!");
      } else {
        await ParticipantService.createParticipant(formData);
        alert("New participant added successfully!");
      }

      setFormData(initialFormState);
      setEditingId(null);
      fetchParticipants();
    } catch (err) {
      console.error(
        "Error submitting participant:",
        err.response ? err.response.data : err
      );
      alert("Failed to save data. Check the console for errors.");
    }
  };

  const handleEdit = (participant) => {
    setFormData({
      name: participant.name,
      email: participant.email,
      phone_number: participant.phone_number,
    });
    setEditingId(participant.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this participant?")) {
      try {
        await ParticipantService.deleteParticipant(id);
        fetchParticipants();
      } catch (err) {
        alert("Failed to delete participant. Check the console for errors.");
      }
    }
  };

  return (
    <div>
      <h2>Participant Management</h2>

      {/* Participant Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "20px",
        }}
      >
        <h3>
          {editingId
            ? "Edit Participant (ID: " + editingId + ")"
            : "Add New Participant"}
        </h3>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          style={{ padding: "10px", width: "20%", marginBottom: "10px" }}
        />
        <br />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
          style={{ padding: "10px", width: "20%", marginBottom: "10px" }}
        />
        <br />
        <input
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          style={{ padding: "10px", width: "20%", marginBottom: "10px" }}
        />
        <br />
        <button type="submit" style={{ marginTop: "10px", background: "blue", color: "white" }}>
          {editingId ? "Save Changes" : "Add Participant"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData(initialFormState);
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Participant List Display (Read All) */}
      <table className="data-table" border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.phone_number}</td>
              <td>
                <button
                  onClick={() => handleEdit(p)}
                  style={{
                    marginLeft: "10px",
                    background: "green",
                    color: "white",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{
                    marginLeft: "10px",
                    background: "red",
                    color: "white",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantManager;
