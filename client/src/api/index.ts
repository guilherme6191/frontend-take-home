/// <reference types="vite/client" />

export const fetchUsers = async (searchTerm = "", currentPage = "") => {
  const url = new URL(`${import.meta.env.VITE_SERVER_URL}/users`);
  url.searchParams.set("search", searchTerm);
  url.searchParams.set("page", currentPage);
  const response = await fetch(url);
  if (!response.ok) {
    console.log("Failed to fetch users", response.body);
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const fetchRoles = async (searchTerm = "", currentPage = "") => {
  const url = new URL(`${import.meta.env.VITE_SERVER_URL}/roles`);
  url.searchParams.set("search", searchTerm);
  url.searchParams.set("page", currentPage);
  const response = await fetch(url);
  if (!response.ok) {
    console.log("Failed to fetch roles", response.body);
    throw new Error("Failed to fetch roles");
  }
  return response.json();
};
