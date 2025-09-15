import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginApi, logoutApi, LoginResponse } from "@/redux/services/authApi";

export interface AuthState {
  token: string | null;
  role: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
}

const getInitialToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem("token");
const getInitialRole = () =>
  typeof window === "undefined" ? null : localStorage.getItem("role");

const initialState: AuthState = {
  token: getInitialToken(),
  role: getInitialRole(),
  status: "idle",
  error: null,
};

// 🔹 Async thunks
export const login = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    return await loginApi(credentials.email, credentials.password);
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Login failed";
    return rejectWithValue(error);
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { state: { auth: AuthState }; rejectValue: string }
>("auth/logoutUser", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return;
  try {
    await logoutApi(token);
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Logout failed";
    return rejectWithValue(error);
  }
});

// 🔹 Slice
const authSlice = createSlice({
  name: "auth",
  initialState, // ✅ fixed
  reducers: {
    setAuth(state, action: PayloadAction<LoginResponse>) {
      state.token = action.payload.token;
      state.role = action.payload.role;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("role", action.payload.role);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.role = action.payload.role;
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("role", action.payload.role);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? "Login failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.token = null;
        state.role = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      });
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
