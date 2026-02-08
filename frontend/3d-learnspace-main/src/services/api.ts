import axios from "axios";

export const API_BASE = "https://edu3d-project-backup.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
});

export const loginUser = async (data:any) => {
  const res = await fetch(`${API_BASE}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const registerUser = async (data:any) => {
  const res = await fetch(`${API_BASE}/api/users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getModels = async (token:string) => {
  const res = await fetch(`${API_BASE}/api/models/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
