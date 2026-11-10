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
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../context/transactioncontext";
import { formatCurrency } from "../constants/categories";

export default function Navbar({ onOpenAddModal }) {
  const { currentUser, logout } = useAuth();
  const { transactions, seedSampleData } = useTransactions();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
  }, 0);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
      isActive
        ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
    }`;

  const mobileSidebarLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
      isActive
        ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-md shadow-indigo-500/10"
        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
    }`;

  const closeSidebar = () => setMobileSidebarOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Left: Mobile Hamburger & Brand Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/60 text-slate-300 transition hover:bg-slate-700 hover:text-white active:scale-95 md:hidden"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Brand / Logo */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-900">
                  <Wallet className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-indigo-400" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-full w-full rounded-full bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-tight text-white sm:text-xl">
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
          </div>

          {/* Center: Desktop Navigation Tabs (React Router) */}
          <nav className="hidden md:flex items-center gap-1.5 rounded-2xl border border-slate-700/60 bg-slate-800/40 p-1">
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Net balance badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/50 px-2.5 py-1 text-xs backdrop-blur-md sm:px-3.5 sm:py-1.5">
              <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">Net:</span>
              <span
                className={`font-semibold tracking-tight text-xs sm:text-sm ${
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
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-600 hover:to-indigo-700 hover:shadow-indigo-500/40 active:scale-95 sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">New Transaction</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}

            {/* Desktop User Profile Menu */}
            {currentUser && (
              <div className="relative hidden md:block">
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

      {/* 📱 MOBILE SIDEBAR DRAWER (Slides in from the left) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeSidebar}
          />

          {/* Off-canvas Sidebar Content */}
          <div className="relative flex h-full w-80 max-w-[85vw] flex-col justify-between border-r border-slate-800 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-left duration-300">
            {/* Top Section */}
            <div className="space-y-6">
              {/* Sidebar Header & Close Button */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 p-0.5">
                    <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-900">
                      <Wallet className="h-4.5 w-4.5 text-indigo-400" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Spend<span className="text-indigo-400">Pulse</span>
                    </h2>
                    <p className="text-[11px] text-slate-400">Financial Cockpit</p>
                  </div>
                </div>

                <button
                  onClick={closeSidebar}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Active User Card & Balance */}
              {currentUser && (
                <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-3.5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow">
                      {currentUser.avatar || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-100 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-700/50 pt-2 text-xs">
                    <span className="text-slate-400">Net Balance:</span>
                    <span
                      className={`font-bold ${
                        totalBalance >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatCurrency(totalBalance)}
                    </span>
                  </div>
                </div>
              )}

              {/* Mobile Sidebar Navigation Links */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-2 mb-2">
                  Navigation
                </p>
                <NavLink to="/" end className={mobileSidebarLinkClass} onClick={closeSidebar}>
                  <LayoutDashboard className="h-5 w-5 text-indigo-400" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink to="/transactions" className={mobileSidebarLinkClass} onClick={closeSidebar}>
                  <Receipt className="h-5 w-5 text-indigo-400" />
                  <span>Transactions Ledger</span>
                </NavLink>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    closeSidebar();
                    if (onOpenAddModal) onOpenAddModal();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 active:scale-95 transition"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Record Transaction</span>
                </button>

                <button
                  onClick={() => {
                    seedSampleData();
                    closeSidebar();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/80 py-2 text-xs font-medium text-slate-300 hover:text-white transition"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Load Sample Demo Data</span>
                </button>
              </div>
            </div>

            {/* Bottom Section: Sign Out */}
            <div className="border-t border-slate-800/80 pt-4">
              <button
                onClick={() => {
                  logout();
                  closeSidebar();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
