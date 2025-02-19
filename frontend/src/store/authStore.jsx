import { create } from "zustand";
import axios from "axios";

// Set base API URL dynamically based on environment
const API_URL =
  import.meta.env.VITE_APP_ENV === "production"
    ? "/api/auth" // Adjust this for your production setup
    : "http://localhost:5000/api/auth";

// Enable cookies for cross-origin requests if needed
axios.defaults.withCredentials = true;

// Helper function for making API calls with consistent error handling
const makeRequest = async (method, url, data = null) => {
  try {
    const response = await axios[method](url, data);
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
};

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  // Signup function
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    const result = await makeRequest("post", `${API_URL}/signup`, { email, password, name });
    if (result.success) {
      set({ user: result.data.user, isAuthenticated: true, isLoading: false });
    } else {
      set({ error: result.error, isLoading: false });
      throw new Error(result.error);
    }
  },

  // Login function
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    const result = await makeRequest("post", `${API_URL}/login`, { email, password });
    if (result.success) {
      set({
        isAuthenticated: true,
        user: result.data.user,
        error: null,
        isLoading: false,
      });
    } else {
      set({ error: result.error, isLoading: false });
      throw new Error(result.error);
    }
  },

  // Logout function
  logout: async () => {
    set({ isLoading: true, error: null });
    const result = await makeRequest("post", `${API_URL}/logout`);
    if (result.success) {
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } else {
      set({ error: "Error logging out", isLoading: false });
      throw new Error(result.error);
    }
  },

  // Verify Email function
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    const result = await makeRequest("post", `${API_URL}/verify-email`, { code });
    if (result.success) {
      set({ user: result.data.user, isAuthenticated: true, isLoading: false });
      return result.data;
    } else {
      set({ error: result.error, isLoading: false });
      throw new Error(result.error);
    }
  },

  // Check Authentication Status
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    const result = await makeRequest("get", `${API_URL}/check-auth`);
    if (result.success) {
      set({ user: result.data.user, isAuthenticated: true, isCheckingAuth: false });
    } else {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  // Forgot Password function
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    const result = await makeRequest("post", `${API_URL}/forgot-password`, { email });
    if (result.success) {
      set({ message: result.data.message, isLoading: false });
    } else {
      set({ error: result.error, isLoading: false });
      throw new Error(result.error);
    }
  },

  // Reset Password function
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    const result = await makeRequest("post", `${API_URL}/reset-password/${token}`, { password });
    if (result.success) {
      set({ message: result.data.message, isLoading: false });
    } else {
      set({ error: result.error, isLoading: false });
      throw new Error(result.error);
    }
  },
}));