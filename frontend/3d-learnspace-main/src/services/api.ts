const API_BASE = "http://127.0.0.1:8000";

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
