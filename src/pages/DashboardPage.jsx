import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SummaryCards from "../components/SummaryCards";
import ChartsSection from "../components/ChartsSection";
import BudgetTracker from "../components/BudgetTracker";
import {
  Sparkles,
  Calendar,
  ArrowRight,
  Receipt,
  Target,
} from "lucide-react";

export default function DashboardPage() {
  const { currentUser } = useAuth();

  // Formatted date string
  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const scrollToBudgets = () => {
    const el = document.getElementById("budget-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-800/80 via-slate-800/60 to-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Financial Command Center</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              Welcome back, {currentUser?.name?.split(" ")[0] || "Explorer"} 👋
            </h2>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>{todayStr}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Session Isolated</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/transactions"
              className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white"
            >
              <Receipt className="h-4 w-4 text-indigo-400" />
              <span>View History</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>

            <button
              onClick={scrollToBudgets}
              className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-indigo-300 transition-all hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-white active:scale-95"
            >
              <Target className="h-4 w-4 text-indigo-400" />
              <span>Manage Budgets</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Summary Metric Cards */}
      <section aria-label="Financial Summary Cards">
        <SummaryCards />
      </section>

      {/* 2. Visual Charts & Analytics (Donut Category Breakdown + Cashflow Bar Chart) */}
      <section aria-label="Visual Analytics & Category Breakdown">
        <ChartsSection />
      </section>

      {/* 3. Category Budget Caps & Progress Bars */}
      <section id="budget-section" aria-label="Category Budget Limits" className="scroll-mt-24">
        <BudgetTracker />
      </section>
    </div>
  );
}
