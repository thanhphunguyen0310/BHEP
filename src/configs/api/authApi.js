import apiClient from "./index";

export const loginApi = async (credentials) => {
  const response = await apiClient.post("/Auth/Login", credentials);
  return response.data;
};
