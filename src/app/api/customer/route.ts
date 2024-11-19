import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // Include cookies if needed
});

export default apiClient;
