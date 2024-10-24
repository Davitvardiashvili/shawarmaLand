import { createContext, useContext, useState } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [credential, setCredential] = useState({
    username: null,
    password: null,
  });

  const login = async () => {
    try {
      const res = await axiosInstance.post(`/user/login`, credential);
      const { token, is_admin, is_staff } = res.data;
      if (token) {
        setAuthenticated(true);
        localStorage.setItem("token", "Token " + token);
        localStorage.setItem("is_admin", is_admin);
        localStorage.setItem("is_staff", is_staff);
      }
    } catch (error) {
      console.error("Login error:", error);
      // Optionally, handle error (e.g., set an error state to display a message)
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.delete("/user/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthenticated(false);
      localStorage.removeItem("token");
      localStorage.removeItem("is_admin");
      localStorage.removeItem("is_staff");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        credential,
        setCredential,
        logout,
        setAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
