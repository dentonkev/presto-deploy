import BACKEND_PORT from "../backend.config.json";

const URL = `http://localhost:${BACKEND_PORT.BACKEND_PORT}`;

export const apiLogin = async (email, password) => {
  console.log(URL);
  const res = await fetch(`${URL}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data.token;
};

// export const apiRegister = async (name, email, password, confirmPassword) => {
//   console.log(URL);
//   const res = await fetch(`${URL}/admin/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
//   const data = await res.json();
//   if (!res.ok) {
//     throw new Error(data.message || "Login failed");
//   }
//   return data.token;
// };
