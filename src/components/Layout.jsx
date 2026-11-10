import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import TransactionForm from "./TransactionForm";
import { useTransactions } from "../context/transactioncontext";
import { LayoutDashboard, Receipt, Plus } from "lucide-react";

export default function Layout() {
  const { isupdate, cancelEdit } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAddModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    if (isupdate) cancelEdit();
  };

  const mobileNavLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-semibold transition ${
      isActive
        ? "text-indigo-400"
        : "text-slate-400 hover:text-slate-200"
    }`;

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white pb-20 sm:pb-0">
      {/* Background ambient neon glows */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[130px]" />
      <div className="pointer-events-none fixed top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[130px]" />
      <div className="pointer-events-none fixed -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-rose-500/10 blur-[130px]" />

      {/* Top Navbar */}
      <Navbar onOpenAddModal={openAddModal} />

      {/* Main Routed Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet context={{ onOpenAddModal: openAddModal }} />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-900/60 py-8 text-center backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SpendPulse LocalStorage Isolated Workspace • React Router Multi-Page</span>
            </div>
            <p className="text-xs text-slate-500">
              Crafted with React 19, React Router Dom, Tailwind CSS & Recharts
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Hidden on sm and larger) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-xl sm:hidden">
        <div className="flex items-center justify-around py-2">
          <NavLink to="/" end className={mobileNavLinkClass}>
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>

          {/* Quick Add Floating Center Button */}
          <button
            onClick={openAddModal}
            className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/40 border-2 border-slate-900 active:scale-95 transition"
          >
            <Plus className="h-6 w-6" />
          </button>

          <NavLink to="/transactions" className={mobileNavLinkClass}>
            <Receipt className="h-5 w-5" />
            <span>Transactions</span>
          </NavLink>
        </div>
      </div>

      {/* Modal for Add / Edit Transaction */}
      {(isModalOpen || isupdate) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-lg animate-in zoom-in-95 duration-200">
            <TransactionForm onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}
