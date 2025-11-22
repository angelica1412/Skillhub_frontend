import axios from "axios";
const API_URL = "http://localhost:3000/api/classes";

class ClassService {
  getAllClasses() {
    return axios.get(API_URL);
  }
  createClass(data) {
    return axios.post(API_URL, data);
  }
  updateClass(id, data) {
    return axios.put(`${API_URL}/${id}`, data);
  }
  deleteClass(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new ClassService();
