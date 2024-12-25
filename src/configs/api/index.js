import axios from 'axios';
// URL dev
// const BASE_URL = 'https://bhepapi.azurewebsites.net/Api/V1';
// URL Production
// const BASE_URL = 'https://44f6-103-77-167-61.ngrok-free.app/Api/V1' 
 const BASE_URL = 'https://cleanly-divine-pegasus.ngrok-free.app/Api/V1'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default apiClient;
