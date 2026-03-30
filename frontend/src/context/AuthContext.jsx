import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, updateProfile as updateProfileAPI, changePassword as changePasswordAPI } from "../service/user_service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStoredToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const getStoredUser = () =>
    localStorage.getItem("user") || sessionStorage.getItem("user");

  useEffect(() => {
    const savedToken = getStoredToken();
    const savedUser = getStoredUser();

    if (savedToken) setToken(savedToken);

    try {
      if (savedUser && savedUser !== "undefined") {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Lỗi parse user:", err);
      setUser(null);
    }

    setLoading(false);

    const handleStorageChange = () => {
      const updatedToken = getStoredToken();
      const updatedUser = getStoredUser();

      setToken(updatedToken);

      try {
        setUser(
          updatedUser && updatedUser !== "undefined"
            ? JSON.parse(updatedUser)
            : null
        );
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const savedToken = getStoredToken();
      if (!savedToken) return;

      const res = await getProfile();

      const userData = {
        ...res.data,
        name: res.data.username,
      };

      setUser(userData);

      if (localStorage.getItem("token")) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchProfile();
}, []);

const updateProfile = async (data) => {
  try {
    await updateProfileAPI(data);

    const res = await getProfile();

    const userData = {
      ...res.data,
      name: res.data.username,
    };

    setUser(userData);

    if (localStorage.getItem("token")) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("user", JSON.stringify(userData));
    }

  } catch (err) {
    throw err;
  }
};

const changePassword = async (data) => {
  try {
    await changePasswordAPI(data);
  } catch (err) {
    throw err;
  }
};

  const login = (token, user, remember = false) => {
    setToken(token);
    setUser(user || null);

    if (remember) {
      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("token", token);
      if (user) sessionStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, updateProfile, changePassword  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);