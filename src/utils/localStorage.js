// "use client";
export const saveToLocalStorage = (key, token) => {
  if (!token || typeof window === "undefined") {
    return "";
  }
  if (typeof window !== "undefined") {
    const value = localStorage.setItem(key, token);
    return value;
  }
};

export const getFromLocalStorage = (key) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key);
    return value;
  }
};

export const removeFromLocalStorage = (key) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  if (typeof window !== "undefined") {
    const value = localStorage.removeItem(key);
    return value;
  }
};
