import BACKEND_PORT from "../backend.config.json";

const URL = `http://localhost:${BACKEND_PORT.BACKEND_PORT}`;

export const apiLogin = async (email, password) => {
  const res = await fetch(`${URL}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data.token;
};

export const apiRegister = async (name, email, password, confirmPassword) => {
  const res = await fetch(`${URL}/admin/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data.token;
};
