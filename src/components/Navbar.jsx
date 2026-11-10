import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Wallet,
  LogOut,
  PlusCircle,
  RotateCcw,
  ChevronDown,
  LayoutDashboard,
  Receipt,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../context/transactioncontext";
import { formatCurrency } from "../constants/categories";

export default function Navbar({ onOpenAddModal }) {
  const { currentUser, logout } = useAuth();
  const { transactions, seedSampleData } = useTransactions();
  const [menuOpen, setMenuOpen] = useState(false);

  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
  }, 0);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
      isActive
        ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-900">
              <Wallet className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Spend<span className="text-indigo-400">Pulse</span>
              </h1>
              <span className="hidden rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300 sm:inline-block">
                Pro
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 md:block">
              Intelligent Financial Cockpit
            </p>
          </div>
        </Link>

        {/* Navigation Tabs (React Router) */}
        <nav className="flex items-center gap-1.5 rounded-2xl border border-slate-700/60 bg-slate-800/40 p-1">
          <NavLink to="/" end className={navLinkClass}>
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/transactions" className={navLinkClass}>
            <Receipt className="h-4 w-4" />
            <span>Transactions</span>
          </NavLink>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Net balance badge */}
          <div className="hidden items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/50 px-3.5 py-1.5 backdrop-blur-md lg:flex">
            <span className="text-xs font-medium text-slate-400">Net:</span>
            <span
              className={`font-semibold tracking-tight text-sm ${
                totalBalance >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {formatCurrency(totalBalance)}
            </span>
          </div>

          {/* Quick Add Button */}
          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-600 hover:to-indigo-700 hover:shadow-indigo-500/40 active:scale-95 sm:text-sm"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">New Transaction</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}

          {/* User Profile Menu */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-700/60 bg-slate-800/60 p-1.5 pr-3 text-left transition hover:border-slate-600 hover:bg-slate-800 active:scale-95"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow">
                  {currentUser.avatar || "U"}
                </div>
                <div className="hidden text-left xl:block">
                  <div className="text-xs font-semibold text-slate-200">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[120px]">
                    {currentUser.email}
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 z-50 w-64 rounded-2xl border border-slate-700/80 bg-slate-800/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="border-b border-slate-700/50 px-3 py-2.5">
                      <p className="text-xs font-medium text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-100 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-indigo-400 truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          seedSampleData();
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700/50 hover:text-white"
                      >
                        <RotateCcw className="h-4 w-4 text-emerald-400" />
                        <span>Load Sample Demo Data</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-700/50 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
