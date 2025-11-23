import axios from 'axios';

const API_URL = 'http://localhost:3000/api/participants'; 

class ParticipantService {
  getAllParticipants() {
    return axios.get(API_URL);
  }

  createParticipant(data) {
    return axios.post(API_URL, data);
  }

  updateParticipant(id, data) {
    return axios.put(`${API_URL}/${id}`, data);
  }

  deleteParticipant(id) {
    return axios.delete(`${API_URL}/${id}`);
  }

  getParticipantById(id) {
    return axios.get(`${API_URL}/${id}`);
  }
}

export default new ParticipantService();