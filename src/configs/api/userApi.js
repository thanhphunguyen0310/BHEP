import axios from "axios";
import apiClient from "./index";

export const getUserDetail = async (id) => {
  try {
    const response = await apiClient.get(`/User/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// export const updateUserDetail = async (id, formData) => {
//   try {
//     const response = await axios.put(
//       `https://bhepapi.azurewebsites.net/Api/V1/User/${id}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error updating user data:", error);
//     throw error;
//   }
// };

export const updateUserDetail = async (id, formData) => {
  try {
    const response = await axios.put(
      `https://cleanly-divine-pegasus.ngrok-free.app/Api/V1/User/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

