import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { DEFAULT_BUDGETS } from "../constants/categories";
import { getInitialTransactions, DEMO_USER } from "../constants/demoData";

const TransactionContext = createContext();

const getFormattedToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
};

export function TransactionProvider({ children }) {
  const { currentUser } = useAuth();
  const email = currentUser?.email || "guest";

  const [isupdate, setIsupdate] = useState(false);

  // Form state
  const [newtransaction, setNewtransaction] = useState({
    id: "",
    description: "",
    amount: "",
    type: "expense",
    date: getFormattedToday(),
    category: "food"
  });

  // Load transactions for current active user
  const [transactions, setTransactions] = useState(() => {
    if (!currentUser) return [];
    try {
      const saved = localStorage.getItem(`transactions_${currentUser.email}`);
      if (saved) return JSON.parse(saved);
      if (currentUser.email === DEMO_USER.email) {
        return getInitialTransactions();
      }
    } catch (e) {
      console.error("Error loading user transactions", e);
    }
    return [];
  });

  // Load budgets for current active user
  const [budgets, setBudgets] = useState(() => {
    if (!currentUser) return DEFAULT_BUDGETS;
    try {
      const saved = localStorage.getItem(`budgets_${currentUser.email}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error loading user budgets", e);
    }
    return DEFAULT_BUDGETS;
  });

  // Sync transactions to user-specific localStorage key
  useEffect(() => {
    if (email && email !== "guest") {
      try {
        localStorage.setItem(`transactions_${email}`, JSON.stringify(transactions));
      } catch (e) {
        console.error("Failed to persist user transactions", e);
      }
    }
  }, [transactions, email]);

  // Sync budgets to user-specific localStorage key
  useEffect(() => {
    if (email && email !== "guest") {
      try {
        localStorage.setItem(`budgets_${email}`, JSON.stringify(budgets));
      } catch (e) {
        console.error("Failed to persist user budgets", e);
      }
    }
  }, [budgets, email]);

  // Update budget cap for a category
  const updateBudget = (category_name, newBudget) => {
    const val = Number(newBudget);
    if (isNaN(val) || val < 0) return;
    setBudgets((prev) => ({
      ...prev,
      [category_name]: val,
    }));
  };

  // Prepare edit transaction
  const editTransactions = (transaction) => {
    setIsupdate(true);
    setNewtransaction({
      id: transaction.id,
      description: transaction.description || "",
      amount: transaction.amount || "",
      type: transaction.type || "expense",
      date: transaction.date || getFormattedToday(),
      category: transaction.category || (transaction.type === "income" ? "salary" : "food"),
    });
  };

  const cancelEdit = () => {
    setIsupdate(false);
    setNewtransaction({
      id: "",
      description: "",
      amount: "",
      type: "expense",
      date: getFormattedToday(),
      category: "food",
    });
  };

  const getdate = () => getFormattedToday();

  // Add or update transaction
  const addTransactions = (transactionItem) => {
    // If we're updating an existing item
    const existingIndex = transactions.findIndex(
      (item) => String(item.id) === String(newtransaction.id)
    );

    if (existingIndex > -1 || isupdate) {
      const updated = {
        id: newtransaction.id || transactionItem.id || Date.now(),
        description: newtransaction.description,
        amount: Number(newtransaction.amount),
        type: newtransaction.type,
        date: newtransaction.date,
        category: newtransaction.category || (newtransaction.type === "income" ? "salary" : "others"),
      };

      setTransactions((prev) =>
        prev.map((item) => (String(item.id) === String(updated.id) ? updated : item))
      );
      setIsupdate(false);
      setNewtransaction({
        id: "",
        description: "",
        amount: "",
        type: "expense",
        date: getFormattedToday(),
        category: "food",
      });
      return;
    }

    // New transaction
    const finalItem = {
      id: transactionItem.id || Date.now(),
      description: transactionItem.description,
      amount: Number(transactionItem.amount),
      type: transactionItem.type,
      date: transactionItem.date || getFormattedToday(),
      category: transactionItem.category || (transactionItem.type === "income" ? "salary" : "others"),
    };

    setTransactions((prev) => [finalItem, ...prev]);
    setNewtransaction({
      id: "",
      description: "",
      amount: "",
      type: "expense",
      date: getFormattedToday(),
      category: "food",
    });
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((item) => String(item.id) !== String(id)));
    if (isupdate && String(newtransaction.id) === String(id)) {
      cancelEdit();
    }
  };

  // Seed sample data for current user
  const seedSampleData = () => {
    const samples = getInitialTransactions();
    setTransactions(samples);
    setBudgets(DEFAULT_BUDGETS);
  };

  // Clear all data for current user
  const clearAllData = () => {
    setTransactions([]);
    setBudgets(DEFAULT_BUDGETS);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransactions,
        deleteTransaction,
        newtransaction,
        setNewtransaction,
        editTransactions,
        cancelEdit,
        isupdate,
        setIsupdate,
        getdate,
        budgets,
        setBudgets,
        updateBudget,
        seedSampleData,
        clearAllData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export default TransactionProvider;

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
}
