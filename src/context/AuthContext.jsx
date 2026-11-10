import { createContext, useContext, useState, useEffect } from "react";
import { DEMO_USER, getInitialTransactions } from "../constants/demoData";
import { DEFAULT_BUDGETS } from "../constants/categories";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize registered users from localStorage or preseed with DEMO_USER
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem("registered_users");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) { 
      console.error("Failed to parse registered_users from localStorage", e);
    }
    // Seed default demo user
    const defaultList = [
      {
        id: DEMO_USER.id,
        name: DEMO_USER.name,
        email: DEMO_USER.email,
        password: "password123",
      },
    ];
    localStorage.setItem("registered_users", JSON.stringify(defaultList));
    return defaultList;
  });

  // Active session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const active = localStorage.getItem("current_user");
      if (active) {
        return JSON.parse(active);
      }
    } catch (e) {
      console.error("Failed to parse current_user from localStorage", e);
    }
    // Automatically log in Demo User initially so app is immediately interactive
    localStorage.setItem("current_user", JSON.stringify(DEMO_USER));
    return DEMO_USER;
  });

  // Seed demo transactions and budgets if this is the demo user and nothing exists yet
  useEffect(() => {
    if (currentUser?.email === DEMO_USER.email) {
      const keyTx = `transactions_${DEMO_USER.email}`;
      const keyBg = `budgets_${DEMO_USER.email}`;
      if (!localStorage.getItem(keyTx)) {
        localStorage.setItem(keyTx, JSON.stringify(getInitialTransactions()));
      }
      if (!localStorage.getItem(keyBg)) {
        localStorage.setItem(keyBg, JSON.stringify(DEFAULT_BUDGETS));
      }
    }
  }, [currentUser]);

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("registered_users", JSON.stringify(users));
    } catch (e) {
      console.error("Failed to store registered_users", e);
    }
  }, [users]);

  // Sync current user session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("current_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("current_user");
      }
    } catch (e) {
      console.error("Failed to update current_user in localStorage", e);
    }
  }, [currentUser]);

  const login = (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (!found) {
      return { success: false, message: "Invalid email or password" };
    }

    const sessionUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      avatar: found.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U",
    };

    setCurrentUser(sessionUser);
    return { success: true, user: sessionUser };
  };

  const signup = (name, email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanName = (name || "").trim();

    if (!cleanName || !cleanEmail || !password) {
      return { success: false, message: "Please fill in all required fields" };
    }

    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters" };
    }

    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: "An account with this email already exists" };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: password,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    // Initialize user's starting budget
    const budgetKey = `budgets_${cleanEmail}`;
    if (!localStorage.getItem(budgetKey)) {
      localStorage.setItem(budgetKey, JSON.stringify(DEFAULT_BUDGETS));
    }

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U",
    };

    setCurrentUser(sessionUser);
    return { success: true, user: sessionUser };
  };

  const loginAsDemo = () => {
    setCurrentUser(DEMO_USER);
    const keyTx = `transactions_${DEMO_USER.email}`;
    const keyBg = `budgets_${DEMO_USER.email}`;
    if (!localStorage.getItem(keyTx)) {
      localStorage.setItem(keyTx, JSON.stringify(getInitialTransactions()));
    }
    if (!localStorage.getItem(keyBg)) {
      localStorage.setItem(keyBg, JSON.stringify(DEFAULT_BUDGETS));
    }
    return { success: true, user: DEMO_USER };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        signup,
        loginAsDemo,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
