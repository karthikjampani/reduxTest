"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/features/Auth/authSlice";

export default function LoginButton() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("kk.sponge389@aleeas.com");
  const [password, setPassword] = useState("@Password123");

  const handleLogin = async () => {
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      // success — token in payload
      console.log("Logged in, token:", resultAction.payload);
      // you can redirect or update UI here
    } else {
      // failure
      const err = resultAction.payload ?? resultAction.error?.message;
      console.error("Login failed:", err);
      // show error toast / message
    }
  };

  return (
    <div>
      <h3>Login</h3>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        type="password"
      />
      <button onClick={handleLogin} disabled={auth.status === "loading"}>
        {auth.status === "loading" ? "Logging in..." : "Login"}
      </button>

      {auth.token && (
        <div>
          <p>Token stored in Redux + localStorage</p>
        </div>
      )}
      {auth.error && <p style={{ color: "red" }}>{auth.error}</p>}
    </div>
  );
}
