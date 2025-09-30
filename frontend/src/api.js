const API_URL = "http://localhost:8080/api";

export async function login(username, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json(); // returns { token: "..." }
}

export async function getAccounts(token, username) {
  const response = await fetch(`${API_URL}/accounts/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch accounts");
  }

  return response.json(); // returns list of accounts
}