"use client";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { login, logoutUser } from "@/redux/features/Auth/authSlice";

export default function Home() {
  const { token, role, status, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [hydrated, setHydrated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Auth State</h2>
      <p>Token: {token ?? "No token"}</p>
      <p>Role: {role ?? "No role"}</p>
      <p>Status: {status}</p>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!token ? (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={status === "loading"}
            onClick={() => dispatch(login({ email, password }))}
          >
            {status === "loading" ? "Logging in..." : "Login"}
          </button>
        </div>
      ) : (
        <button
          disabled={status === "loading"}
          onClick={() => dispatch(logoutUser())}
        >
          {status === "loading" ? "Logging out..." : "Logout"}
        </button>
      )}
    </div>
  );
}

//  login({ email: "kk.sponge389@aleeas.com", password: "@Password123" })
