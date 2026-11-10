import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { PieChart as PieIcon, BarChart3, AlertCircle } from "lucide-react";
import { useTransactions } from "../context/transactioncontext";
import { formatCurrency, getCategoryMeta } from "../constants/categories";

// Custom Dark Glassmorphic Tooltip for Donut Pie Chart
const CustomDonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/95 p-3 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="text-xs font-semibold text-slate-200">
            {data.name}
          </span>
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-4">
          <span className="text-sm font-bold text-white">
            {formatCurrency(data.value)}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {data.percentage}% of total
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Dark Glassmorphic Tooltip for Bar Chart
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const income = payload.find((p) => p.dataKey === "income")?.value || 0;
    const expense = payload.find((p) => p.dataKey === "expense")?.value || 0;
    const net = income - expense;

    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/95 p-3.5 shadow-2xl backdrop-blur-xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-700/60 pb-1">
          {label}
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Income:
            </span>
            <span className="font-bold text-slate-100">{formatCurrency(income)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              Expense:
            </span>
            <span className="font-bold text-slate-100">{formatCurrency(expense)}</span>
          </div>
          <div className="border-t border-slate-700/60 pt-1.5 flex items-center justify-between gap-4 font-semibold">
            <span className="text-slate-300">Net Cashflow:</span>
            <span className={net >= 0 ? "text-emerald-400" : "text-rose-400"}>
              {formatCurrency(net)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ChartsSection() {
  const { transactions } = useTransactions();

  // 1. Process data for Category Breakdown Donut Chart
  const { categoryData, totalExpense } = useMemo(() => {
    const expenseTransactions = transactions.filter((t) => t.type === "expense");
    const sumTotal = expenseTransactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    const categoryTotals = {};
    expenseTransactions.forEach((t) => {
      const cat = (t.category || "others").toLowerCase().trim();
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(t.amount || 0);
    });

    const items = Object.entries(categoryTotals).map(([catKey, amount]) => {
      const meta = getCategoryMeta(catKey);
      const percentage = sumTotal > 0 ? Math.round((amount / sumTotal) * 100) : 0;
      return {
        key: catKey,
        name: meta.label,
        value: amount,
        color: meta.color,
        percentage,
        icon: meta.icon,
      };
    });

    // Sort descending by value
    items.sort((a, b) => b.value - a.value);

    return { categoryData: items, totalExpense: sumTotal };
  }, [transactions]);

  // 2. Process data for Monthly Cashflow Bar Chart
  const monthlyData = useMemo(() => {
    const monthsMap = {};

    transactions.forEach((t) => {
      if (!t.date) return;
      const monthKey = t.date.slice(0, 7); // "YYYY-MM"
      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { monthKey, income: 0, expense: 0 };
      }
      if (t.type === "income") {
        monthsMap[monthKey].income += Number(t.amount || 0);
      } else {
        monthsMap[monthKey].expense += Number(t.amount || 0);
      }
    });

    // Ensure we have at least 1 month
    const keys = Object.keys(monthsMap).sort();
    if (keys.length === 0) {
      const now = new Date();
      const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      monthsMap[currentKey] = { monthKey: currentKey, income: 0, expense: 0 };
      keys.push(currentKey);
    }

    // Format label (e.g. "2026-10" -> "Oct 26")
    return keys.map((key) => {
      const [year, month] = key.split("-");
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      const label = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      return {
        rawMonth: key,
        month: label,
        income: monthsMap[key].income,
        expense: monthsMap[key].expense,
      };
    });
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Chart 1: Category Breakdown Donut / Pie Chart (5 Cols on LG) */}
      <div className="flex flex-col rounded-2xl border border-slate-700/50 bg-slate-800/60 p-4 sm:p-6 shadow-xl backdrop-blur-md lg:col-span-5 min-w-0 w-full overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
              <PieIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Expense Distribution
              </h3>
              <p className="text-xs text-slate-400">By category breakdown</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {categoryData.length} Categories
          </span>
        </div>

        {categoryData.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-10 w-10 text-slate-500 mb-2" />
            <p className="text-sm font-medium text-slate-300">
              No Expense Data Yet
            </p>
            <p className="text-xs text-slate-500 max-w-[200px] mt-1">
              Add some expenses to see visual distribution charts.
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-w-0">
            {/* Donut Chart container */}
            <div className="relative h-60 sm:h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
                <PieChart>
                  <RechartsTooltip content={<CustomDonutTooltip />} />
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#1e293b"
                    strokeWidth={2}
                  >
                    {categoryData.map((entry) => (
                      <Cell key={`cell-${entry.key}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Total Overlay */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Total Spent
                </span>
                <span className="text-lg font-extrabold text-white">
                  {formatCurrency(totalExpense)}
                </span>
              </div>
            </div>

            {/* Custom Interactive Legend / Chips */}
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-700/50 pt-4 sm:grid-cols-2">
              {categoryData.slice(0, 6).map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-900/40 px-2.5 py-1.5 transition hover:bg-slate-700/30"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {IconComponent && (
                        <IconComponent
                          className="h-3.5 w-3.5 shrink-0"
                          style={{ color: item.color }}
                        />
                      )}
                      <span className="truncate text-xs font-medium text-slate-300">
                        {item.name}
                      </span>
                    </div>
                    <span className="ml-1 shrink-0 text-xs font-bold text-slate-200">
                      {item.percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Chart 2: Monthly Cashflow Bar Chart (7 Cols on LG) */}
      <div className="flex flex-col rounded-2xl border border-slate-700/50 bg-slate-800/60 p-4 sm:p-6 shadow-xl backdrop-blur-md lg:col-span-7 min-w-0 w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Monthly Cashflow Dynamics
              </h3>
              <p className="text-xs text-slate-400">Income vs. Expenses comparison</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs self-start sm:self-auto">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              <span className="text-slate-300">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
              <span className="text-slate-300">Expenses</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="relative h-64 sm:h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -5, bottom: 0 }}
              barGap={3}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                opacity={0.5}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                width={38}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <RechartsTooltip
                content={<CustomBarTooltip />}
                cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="expense"
                name="Expenses"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
