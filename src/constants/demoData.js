export const DEMO_USER = {
  id: "usr_demo_1",
  name: "Vetri",
  email: "vetrivirat@gmail.com",
  avatar: "VE",
};

export const getInitialTransactions = () => {
  const now = new Date();
  const year = now.getFullYear();
  const currentMonthStr = String(now.getMonth() + 1).padStart(2, "0");

  const prevMonthDate = new Date(year, now.getMonth() - 1, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonthStr = String(prevMonthDate.getMonth() + 1).padStart(2, "0");

  const twoMonthsAgoDate = new Date(year, now.getMonth() - 2, 1);
  const twoMonthsAgoYear = twoMonthsAgoDate.getFullYear();
  const twoMonthsAgoMonthStr = String(twoMonthsAgoDate.getMonth() + 1).padStart(2, "0");

  return [
    // Current Month Income
    {
      id: "tx-cur-1",
      description: "Monthly Tech Salary",
      amount: 75000,
      type: "income",
      category: "salary",
      date: `${year}-${currentMonthStr}-01`,
    },
    {
      id: "tx-cur-2",
      description: "Mobile App UI Consulting",
      amount: 18500,
      type: "income",
      category: "freelance",
      date: `${year}-${currentMonthStr}-08`,
    },
    {
      id: "tx-cur-3",
      description: "Dividend Payout - Index Fund",
      amount: 3200,
      type: "income",
      category: "investments",
      date: `${year}-${currentMonthStr}-14`,
    },

    // Current Month Expenses
    {
      id: "tx-cur-4",
      description: "Luxury Apartment Rent & Maintenance",
      amount: 17500,
      type: "expense",
      category: "housing",
      date: `${year}-${currentMonthStr}-02`,
    },
    {
      id: "tx-cur-5",
      description: "Organic Groceries & Gourmet Kitchen",
      amount: 4800,
      type: "expense",
      category: "food",
      date: `${year}-${currentMonthStr}-05`,
    },
    {
      id: "tx-cur-6",
      description: "Weekend Fine Dining & Bistro",
      amount: 2400,
      type: "expense",
      category: "food",
      date: `${year}-${currentMonthStr}-11`,
    },
    {
      id: "tx-cur-7",
      description: "Gasoline & EV Fast Charging",
      amount: 3200,
      type: "expense",
      category: "transportation",
      date: `${year}-${currentMonthStr}-07`,
    },
    {
      id: "tx-cur-8",
      description: "Uber & Airport Transit",
      amount: 1100,
      type: "expense",
      category: "transportation",
      date: `${year}-${currentMonthStr}-16`,
    },
    {
      id: "tx-cur-9",
      description: "Streaming Services & Cinema IMAX",
      amount: 1850,
      type: "expense",
      category: "entertainment",
      date: `${year}-${currentMonthStr}-09`,
    },
    {
      id: "tx-cur-10",
      description: "Ergonomic Mechanical Keyboard",
      amount: 4200,
      type: "expense",
      category: "shopping",
      date: `${year}-${currentMonthStr}-12`,
    },
    {
      id: "tx-cur-11",
      description: "Gym Membership & Nutrition",
      amount: 2500,
      type: "expense",
      category: "health",
      date: `${year}-${currentMonthStr}-04`,
    },
    {
      id: "tx-cur-12",
      description: "Cloud Hosting & Domain Renewal",
      amount: 1200,
      type: "expense",
      category: "others",
      date: `${year}-${currentMonthStr}-18`,
    },

    // Previous Month Data (for Cashflow Bar Chart!)
    {
      id: "tx-prev-1",
      description: "Previous Month Tech Salary",
      amount: 75000,
      type: "income",
      category: "salary",
      date: `${prevYear}-${prevMonthStr}-01`,
    },
    {
      id: "tx-prev-2",
      description: "Web Development Sprint",
      amount: 22000,
      type: "income",
      category: "freelance",
      date: `${prevYear}-${prevMonthStr}-15`,
    },
    {
      id: "tx-prev-3",
      description: "Apartment Rent",
      amount: 17500,
      type: "expense",
      category: "housing",
      date: `${prevYear}-${prevMonthStr}-02`,
    },
    {
      id: "tx-prev-4",
      description: "Groceries & Supermarket",
      amount: 5800,
      type: "expense",
      category: "food",
      date: `${prevYear}-${prevMonthStr}-10`,
    },
    {
      id: "tx-prev-5",
      description: "Shopping & Apparel Sale",
      amount: 6200,
      type: "expense",
      category: "shopping",
      date: `${prevYear}-${prevMonthStr}-18`,
    },
    {
      id: "tx-prev-6",
      description: "Metro & Fuel",
      amount: 3800,
      type: "expense",
      category: "transportation",
      date: `${prevYear}-${prevMonthStr}-22`,
    },

    // 2 Months Ago Data
    {
      id: "tx-two-1",
      description: "Tech Salary",
      amount: 72000,
      type: "income",
      category: "salary",
      date: `${twoMonthsAgoYear}-${twoMonthsAgoMonthStr}-01`,
    },
    {
      id: "tx-two-2",
      description: "Freelance Project Milestone",
      amount: 14000,
      type: "income",
      category: "freelance",
      date: `${twoMonthsAgoYear}-${twoMonthsAgoMonthStr}-12`,
    },
    {
      id: "tx-two-3",
      description: "Rent & Utilities",
      amount: 17500,
      type: "expense",
      category: "housing",
      date: `${twoMonthsAgoYear}-${twoMonthsAgoMonthStr}-03`,
    },
    {
      id: "tx-two-4",
      description: "Dining & Social Outings",
      amount: 4900,
      type: "expense",
      category: "food",
      date: `${twoMonthsAgoYear}-${twoMonthsAgoMonthStr}-15`,
    },
    {
      id: "tx-two-5",
      description: "Health Checkup & Pharmacy",
      amount: 3100,
      type: "expense",
      category: "health",
      date: `${twoMonthsAgoYear}-${twoMonthsAgoMonthStr}-20`,
    },
  ];
};
