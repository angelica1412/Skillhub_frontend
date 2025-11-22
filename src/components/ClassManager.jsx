import { useState, useEffect } from "react";
import ClassService from "../services/ClassService";
import "../App.css";

const initialFormState = { class_name: "", description: "", instructor: "" };

const ClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await ClassService.getAllClasses();
      setClasses(response.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
      alert(
        "Failed to load class data. Make sure the backend is running & CORS is enabled."
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
        await ClassService.updateClass(editingId, formData);
        alert("Class updated successfully!");
      } else {
        await ClassService.createClass(formData);
        alert("New class added successfully!");
      }

      setFormData(initialFormState);
      setEditingId(null);
      fetchClasses();
    } catch (err) {
      console.error(
        "Error submitting class:",
        err.response ? err.response.data : err
      );
      alert(
        "Failed to save data. Check the console for errors. (Ensure class_name is unique!)"
      );
    }
  };

  const handleEdit = (classData) => {
    setFormData({
      class_name: classData.class_name,
      description: classData.description,
      instructor: classData.instructor,
    });
    setEditingId(classData.id);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this class? This will also delete all associated enrollments."
      )
    ) {
      try {
        await ClassService.deleteClass(id);
        fetchClasses();
      } catch (err) {
        alert("Failed to delete class. Check the console for errors.");
      }
    }
  };

  return (
    <div>
      <h2>Class Management</h2> {/* Translated Heading */}
      {/* Class Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "20px",
        }}
      >
        <h3>
          {editingId ? "Edit Class (ID: " + editingId + ")" : "Add New Class"}
        </h3>
        <input
          name="class_name"
          value={formData.class_name}
          onChange={handleChange}
          placeholder="Class Name"
          required
          style={{ padding: "10px", width: "20%", marginBottom: "10px" }}
        />
        <br />
        <input
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
          placeholder="Instructor"
          required
          style={{ padding: "10px", width: "20%", marginBottom: "10px" }}
        />
        <br />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Short Description"
          style={{ padding: "10px", width: "20%", marginBottom: "10px" }}
        />
        <br />
        <button type="submit" style={{ background: "blue", color: "white" }}>
          {editingId ? "Save Changes" : "Add Class"}
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
      {/* Class List Display (Read All) */}
      <table
        className="data-table"
        border="1"
        style={{ width: "100%", textAlign: "left" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Class Name</th>
            <th>Instructor</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.class_name}</td>
              <td>{c.instructor}</td>
              <td>{c.description}</td>
              <td>
                <button
                  onClick={() => handleEdit(c)}
                  style={{ background: "green", color: "white" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
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

export default ClassManager;
