import BACKEND_PORT from "../backend.config.json";

// const URL = `http://localhost:${BACKEND_PORT.BACKEND_PORT}`;
const URL = "https://z5480685-z5478458-presto-be-deploy.vercel.app/";

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

export const apiLogout = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${URL}/admin/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error);
  }

  localStorage.removeItem("token");
};

export const apiFetchStore = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${URL}/store`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
      Authorization: `Bearer ${token}`,
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

  const filteredPresentations = oldPresentations.filter((p) => p.id !== pid);

  const res = await fetch(`${URL}/store`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export const apiUpdatePresentation = async (pid, slides) => {
  const token = localStorage.getItem("token");
  const dataStore = await apiFetchStore();

  const store = dataStore.store || {};
  const oldPresentations = store.presentations || [];

  const updatedPresentations = oldPresentations.map((p) =>
    p.id === pid
      ? { ...p, slides }
      : p
  );

  const res = await fetch(`${URL}/store`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      store: {
        ...store,
        presentations: updatedPresentations,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error);
  }
  return updatedPresentations;
};

export const apiEditTitle = async (pid, name) => {
  const token = localStorage.getItem("token");

  const dataStore = await apiFetchStore();

  const store = dataStore.store || {};
  const presentations = store.presentations || [];

  const presentation = presentations.find((p) => p.id === pid);
  presentation.name = name;

  const res = await fetch(`${URL}/store`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export const apiEditPresentation = async (pid, newInfo) => {
  const token = localStorage.getItem("token");

  const dataStore = await apiFetchStore();

  const store = dataStore.store || {};
  const presentations = store.presentations || [];

  const presentation = presentations.find((p) => p.id === pid);
  Object.assign(presentation, newInfo);

  const res = await fetch(`${URL}/store`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
}

export const apiAddElement = async (pid, currSlide, elementInfo, currElement) => {
  const token = localStorage.getItem("token");

  const dataStore = await apiFetchStore();

  const store = dataStore.store || {};
  const presentations = store.presentations || [];

  const presentation = presentations.find((p) => p.id === pid);
  const slide = presentation.slides.find((s) => s.id === currSlide.id);

  if (currElement === null) {
    slide.elements.push(elementInfo);
  } else {
    slide.elements[currElement] = elementInfo;
  }

  const res = await fetch(`${URL}/store`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
}

export const apiDeleteElement = async (pid, currSlide, currElement) => {
  const token = localStorage.getItem("token");

  const dataStore = await apiFetchStore();

  const store = dataStore.store || {};
  const presentations = store.presentations || [];

  const presentation = presentations.find((p) => p.id === pid);
  const slide = presentation.slides.find((s) => s.id === currSlide.id);

  const elements = [...slide.elements];
  elements.splice(currElement, 1); 
  
  slide.elements = elements;

  const res = await fetch(`${URL}/store`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
}

export const apiReorderSlides = async (pid, slides) => {
  const token = localStorage.getItem("token");

  const dataStore = await apiFetchStore();
  const store = dataStore.store || {};
  const presentations = store.presentations || [];

  const presentation = presentations.find((p) => p.id === pid);
  presentation.slides = slides;

  const res = await fetch(`${URL}/store`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
}

export const apiSaveRevision = async (pid, revision) => {
  const token = localStorage.getItem("token");

  const dataStore = await apiFetchStore();
  const store = dataStore.store || {};
  const presentations = store.presentations || [];

  const updatedPresentations = presentations.map((p) => {
    if (p.id !== pid) return p;

    const existingRevisions = p.revisions || [];

    return {
      ...p,
      revisions: [revision, ...existingRevisions],
    };
  });

  const res = await fetch(`${URL}/store`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      store: {
        ...store,
        presentations: updatedPresentations,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error);
  }

  return updatedPresentations;
};