// src/redux/services/authApi.ts
export interface LoginResponse {
  token: string;
  role: string;
}

export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await fetch("https://api-dev.dexai.app/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
      "api-version": "1.0.0",
      "api-lang": "en",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Failed to login");
  }

  const data = await res.json();

  return {
    token: data.data.token,
    role: data.data.role,
  };
};

export const logoutApi = async (token: string): Promise<void> => {
  const res = await fetch("https://api-dev.dexai.app/v1/auth/logout", {
    method: "GET", // ✅ must be GET, not POST
    headers: {
      accept: "*/*",
      "api-version": "1.0.0",
      "api-lang": "en",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to logout");
  }
};
