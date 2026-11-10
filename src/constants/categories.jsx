import {
  Utensils,
  Home,
  Car,
  ShoppingBag,
  HeartPulse,
  Film,
  Package,
  Briefcase,
  Laptop,
  TrendingUp,
} from "lucide-react";

export const CATEGORIES = {
  food: {
    id: "food",
    label: "Food & Dining",
    icon: Utensils,
    type: "expense",
    color: "#f59e0b", // amber-500
    bgClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glowClass: "from-amber-500/20 to-transparent",
  },
  housing: {
    id: "housing",
    label: "Housing & Rent",
    icon: Home,
    type: "expense",
    color: "#6366f1", // indigo-500
    bgClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    glowClass: "from-indigo-500/20 to-transparent",
  },
  transportation: {
    id: "transportation",
    label: "Transportation",
    icon: Car,
    type: "expense",
    color: "#0ea5e9", // sky-500
    bgClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    glowClass: "from-sky-500/20 to-transparent",
  },
  entertainment: {
    id: "entertainment",
    label: "Entertainment",
    icon: Film,
    type: "expense",
    color: "#a855f7", // purple-500
    bgClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    glowClass: "from-purple-500/20 to-transparent",
  },
  shopping: {
    id: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
    type: "expense",
    color: "#ec4899", // pink-500
    bgClass: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    glowClass: "from-pink-500/20 to-transparent",
  },
  health: {
    id: "health",
    label: "Health & Medical",
    icon: HeartPulse,
    type: "expense",
    color: "#10b981", // emerald-500
    bgClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glowClass: "from-emerald-500/20 to-transparent",
  },
  others: {
    id: "others",
    label: "Others / Misc",
    icon: Package,
    type: "both",
    color: "#94a3b8", // slate-400
    bgClass: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    glowClass: "from-slate-500/20 to-transparent",
  },
  salary: {
    id: "salary",
    label: "Salary",
    icon: Briefcase,
    type: "income",
    color: "#10b981", // emerald-500
    bgClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glowClass: "from-emerald-500/20 to-transparent",
  },
  freelance: {
    id: "freelance",
    label: "Freelance",
    icon: Laptop,
    type: "income",
    color: "#3b82f6", // blue-500
    bgClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    glowClass: "from-blue-500/20 to-transparent",
  },
  investments: {
    id: "investments",
    label: "Investments",
    icon: TrendingUp,
    type: "income",
    color: "#8b5cf6", // violet-500
    bgClass: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    glowClass: "from-violet-500/20 to-transparent",
  },
};

export const DEFAULT_BUDGETS = {
  food: 6500,
  housing: 18000,
  transportation: 4500,
  entertainment: 3500,
  shopping: 5500,
  health: 3000,
  others: 2000,
};

// Formats an integer or float amount into Indian Rupee representation (e.g. ₹24,500)
export const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return "₹" + num.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
};

export const getCategoryMeta = (categoryId) => {
  const key = (categoryId || "").toLowerCase().trim();
  if (CATEGORIES[key]) {
    return CATEGORIES[key];
  }
  return {
    id: key || "others",
    label: key ? key.charAt(0).toUpperCase() + key.slice(1) : "Uncategorized",
    icon: Package,
    type: "expense",
    color: "#94a3b8",
    bgClass: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    glowClass: "from-slate-500/20 to-transparent",
  };
};
