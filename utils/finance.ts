export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export interface Transaction {
  id: string;
  transaction_code: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  category_name: string;
  amount: number;
  allocation_type: 'Kebutuhan' | 'Keinginan' | 'Tabungan' | 'Kewajiban';
  status: 'Lunas' | 'Belum Lunas';
  account_id: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  totalObligation: number;
  netCashFlow: number;
  savingsRate: number;
  expenseRatio: number;
}

export const calculateFinancialSummary = (
  transactions: Transaction[],
  activePeriod: string
): FinancialSummary => {
  const periodTx = transactions.filter(
    (tx) => tx.date.startsWith(activePeriod) && tx.status === 'Lunas'
  );

  const totalIncome = periodTx
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const consumptiveExpense = periodTx
    .filter(
      (tx) =>
        tx.type === 'expense' &&
        (tx.allocation_type === 'Kebutuhan' || tx.allocation_type === 'Keinginan')
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSavings = periodTx
    .filter((tx) => tx.type === 'expense' && tx.allocation_type === 'Tabungan')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalObligation = periodTx
    .filter((tx) => tx.type === 'expense' && tx.allocation_type === 'Kewajiban')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = consumptiveExpense + totalSavings + totalObligation;
  const netCashFlow = totalIncome - totalExpense;

  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
  const expenseRatio = totalIncome > 0 ? (consumptiveExpense / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpense: consumptiveExpense,
    totalSavings,
    totalObligation,
    netCashFlow,
    savingsRate,
    expenseRatio,
  };
};
