import axios from 'axios';
const API_URL = 'http://localhost:3000/api/enrollments'; 

class EnrollmentService {
  enroll(data) {
    return axios.post(API_URL, data);
  }
  getClassesByParticipant(participantId) {
    return axios.get(`${API_URL}/participant/${participantId}`);
  }
  getParticipantsByClass(classId) {
    return axios.get(`${API_URL}/class/${classId}`);
  }
  cancelEnrollment(data) {
    return axios.delete(API_URL, { data });
  }
}

export default new EnrollmentService();