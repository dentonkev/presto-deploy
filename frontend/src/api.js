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
    throw new Error(data.error);
  }
  
  return data.token;
};

export const apiRegister = async (name, email, password) => {
  const res = await fetch(`${URL}/admin/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error);
  }

  return data.token;
};

export const apiFetchStore = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${URL}/store`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error);
  }

  return data;
};

export const apiStorePresentation = async (presentation) => {
  const token = localStorage.getItem("token");

  // Get current store
  const dataStore = await apiFetchStore();

  const store = dataStore.store || {};
  const presentations = store.presentations || [];

  presentations.push(presentation);

  const res = await fetch(`${URL}/store`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      store: {
        ...store,
        presentations,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error);
  }

  return presentations;
};

export const apiDeletePresentation = async (pid) => {
  const token = localStorage.getItem("token");

  const dataStore = await apiFetchStore();

  const store = dataStore.store || {};
  const oldPresentations = store.presentations || [];

  const filteredPresentations = oldPresentations.filter(p => p.id !== pid);

  const res = await fetch(`${URL}/store`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      store: {
        ...store,
        presentations: filteredPresentations,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error);
  }

  return filteredPresentations;
};
