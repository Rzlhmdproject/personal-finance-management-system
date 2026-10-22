'use client';

import React, { useState } from 'react';
import { formatRupiah, calculateFinancialSummary, Transaction } from '../utils/finance';

const initialAccounts = [
  { id: 'acc-1', name: 'Rekening Utama (BCA)' },
  { id: 'acc-2', name: 'E-Wallet (Gopay/OVO/Dana)' },
  { id: 'acc-3', name: 'Dompet Tunai' },
];

const initialCategories = [
  { id: 'cat-1', name: 'Gaji Utama', type: 'income', default_allocation: 'Kebutuhan' },
  { id: 'cat-2', name: 'Pemasukan Tambahan', type: 'income', default_allocation: 'Kebutuhan' },
  { id: 'cat-3', name: 'Makan & Minum', type: 'expense', default_allocation: 'Kebutuhan' },
  { id: 'cat-4', name: 'Transportasi & Bensin', type: 'expense', default_allocation: 'Kebutuhan' },
  { id: 'cat-5', name: 'Jajan & Hiburan', type: 'expense', default_allocation: 'Keinginan' },
  { id: 'cat-6', name: 'Tabungan Goal', type: 'expense', default_allocation: 'Tabungan' },
];

const initialTransactions: Transaction[] = [
  {
    id: 'TX-1',
    transaction_code: 'INC-001',
    date: '2026-10-01',
    type: 'income',
    category_name: 'Gaji Utama',
    amount: 2500000,
    allocation_type: 'Kebutuhan',
    status: 'Lunas',
    account_id: 'acc-1',
  },
  {
    id: 'TX-2',
    transaction_code: 'EXP-001',
    date: '2026-10-01',
    type: 'expense',
    category_name: 'Tabungan Goal',
    amount: 500000,
    allocation_type: 'Tabungan',
    status: 'Lunas',
    account_id: 'acc-1',
  },
  {
    id: 'TX-3',
    transaction_code: 'EXP-002',
    date: '2026-10-01',
    type: 'expense',
    category_name: 'Transportasi & Bensin',
    amount: 20000,
    allocation_type: 'Kebutuhan',
    status: 'Lunas',
    account_id: 'acc-2',
  },
];

export default function DashboardPage() {
  const [activePeriod, setActivePeriod] = useState<string>('2026-10');
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  // Form State
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState<string>('2026-10-02');
  const [categoryId, setCategoryId] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [allocation, setAllocation] = useState<string>('Kebutuhan');
  const [status, setStatus] = useState<string>('Lunas');

  const summary = calculateFinancialSummary(transactions, activePeriod);
  const filteredCategories = initialCategories.filter((c) => c.type === type);

  const handleCategoryChange = (catId: string) => {
    setCategoryId(catId);
    const selected = initialCategories.find((c) => c.id === catId);
    if (selected && selected.default_allocation) {
      setAllocation(selected.default_allocation);
    }
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      alert('Nominal harus lebih besar dari 0');
      return;
    }
    const catName = initialCategories.find((c) => c.id === categoryId)?.name || 'Lain-lain';

    const newTx: Transaction = {
      id: 'TX-' + Date.now(),
      transaction_code: (type === 'income' ? 'INC-' : 'EXP-') + Math.floor(Math.random() * 900 + 100),
      date,
      type,
      category_name: catName,
      amount: Number(amount),
      allocation_type: allocation as any,
      status: status as any,
      account_id: accountId,
    };

    setTransactions([newTx, ...transactions]);
    setAmount('');
    alert('Transaksi berhasil dicatat!');
  };

  return (
    <main className="min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Personal Finance Management System</h1>
          <p className="text-sm text-gray-500 mt-1">Sistem Pengelolaan Keuangan Otomatis & Terintegrasi</p>
        </div>
        <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
          <label className="text-xs font-semibold text-gray-600">Periode Aktif:</label>
          <input
            type="month"
            value={activePeriod}
            onChange={(e) => setActivePeriod(e.target.value)}
            className="p-1 bg-white border border-gray-300 rounded-lg font-medium text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Kartu Metrik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Pemasukan</span>
          <div className="text-2xl font-black text-emerald-600 mt-2">{formatRupiah(summary.totalIncome)}</div>
        </div>
        <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pengeluaran Konsumtif</span>
          <div className="text-2xl font-black text-red-500 mt-2">{formatRupiah(summary.totalExpense)}</div>
        </div>
        <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tabungan & Investasi</span>
          <div className="text-2xl font-black text-blue-600 mt-2">{formatRupiah(summary.totalSavings)}</div>
        </div>
        <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Savings Rate</span>
          <div className={`text-2xl font-black mt-2 ${summary.savingsRate >= 20 ? 'text-emerald-600' : 'text-amber-500'}`}>
            {summary.savingsRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Grid Utama: Form & Tabel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Input */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAddTransaction} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Catat Transaksi Baru</h3>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2 font-semibold rounded-xl text-sm transition ${
                  type === 'expense' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2 font-semibold rounded-xl text-sm transition ${
                  type === 'income' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Pemasukan
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nominal (Rp)</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                placeholder="Contoh: 25000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
              >
                <option value="">-- Pilih Kategori --</option>
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Rekening / Dompet</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
              >
                <option value="">-- Pilih Akun --</option>
                {initialAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status Pembayaran</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
              >
                <option value="Lunas">Lunas (Kurangi Saldo)</option>
                <option value="Belum Lunas">Belum Lunas (Tertunda)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-sm text-sm"
            >
              Simpan Transaksi
            </button>
          </form>
        </div>

        {/* Tabel Transaksi */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Daftar Transaksi Periode Ini</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase">
                  <th className="pb-3 font-bold">Kode</th>
                  <th className="pb-3 font-bold">Tanggal</th>
                  <th className="pb-3 font-bold">Kategori</th>
                  <th className="pb-3 font-bold">Nominal</th>
                  <th className="pb-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions
                  .filter((tx) => tx.date.startsWith(activePeriod))
                  .map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-semibold text-gray-700">{tx.transaction_code}</td>
                      <td className="py-3 text-gray-500">{tx.date}</td>
                      <td className="py-3 font-medium text-gray-800">{tx.category_name}</td>
                      <td className={`py-3 font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          tx.status === 'Lunas' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
