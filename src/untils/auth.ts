// utils/auth.ts
import axios from "axios";

const API_URL = process.env.BACK_API_URL as string;
interface AuthResponse {
  token: string;
}

export const registerUser = async (name: string, email: string, password: string, apiUrl: string): Promise<void> => {
  
  await axios.post(`${apiUrl}/register`, {name, email, password });
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, { email, password });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};