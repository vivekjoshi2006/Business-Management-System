"use client";

import React, { useEffect, useState } from 'react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export default function FinanceLedger() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const [type, setType] = useState('INCOME');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Sales');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/finance');
      const data = (await res.json()) as Transaction[];
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInit = (t: Transaction) => {
    setEditingId(t.id);
    setType(t.type);
    setAmount(String(t.amount));
    setCategory(t.category);
    setDescription(t.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setType('INCOME');
    setAmount('');
    setCategory('Sales');
    setDescription('');
  };

const handleDelete = async (id: string) => {
    // globalThis is a safe universal object that bypasses all "window" compiler errors
    const isClient = typeof globalThis !== 'undefined' && 'confirm' in globalThis;
    
    if (isClient) {
      const confirmed = (globalThis as any).confirm('Are you sure you want to delete this inventory item?');
      if (!confirmed) return;
    } else {
      return; 
    }

    try {
      const res = await fetch(`/api/finance/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTransactions();
        if (editingId === id) handleCancelEdit();
      } else {
        if (typeof globalThis !== 'undefined' && 'alert' in globalThis) {
          (globalThis as any).alert('Failed to delete catalog item.');
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/finance/${editingId}` : '/api/finance';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount, category, description }),
      });
      if (res.ok) {
        handleCancelEdit();
        fetchTransactions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === 'INCOME' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Finance Ledger</h1>
        <div className="bg-white px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-500 uppercase">Balance:</span>
          <span className={`text-lg font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Rs. {totalBalance.toLocaleString()}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Type *</label>
          <select value={type} onChange={(e: any) => setType(e.target.value)} className="border p-2.5 rounded w-full text-sm">
            <option value="INCOME">Income (+)</option>
            <option value="EXPENSE">Expense (-)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Amount (Rs.) *</label>
          <input type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} className="border p-2 rounded w-full text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Category *</label>
          <input value={category} onChange={(e: any) => setCategory(e.target.value)} className="border p-2 rounded w-full text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Description</label>
          <input value={description} onChange={(e: any) => setDescription(e.target.value)} className="border p-2 rounded w-full text-sm" />
        </div>
        <div className="md:col-span-4 flex justify-end gap-2">
          <Button type="submit">{editingId ? 'Update Ledger' : 'Post Transaction'}</Button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-sm transition">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="text-center py-6 text-gray-500">Loading ledger data...</div>
      ) : (
        <Table headers={['Date', 'Type', 'Category', 'Description', 'Amount', 'Actions']}>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="px-6 py-4 text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-sm font-medium">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  t.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {t.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{t.category}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{t.description || '-'}</td>
              <td className={`px-6 py-4 text-sm font-semibold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'INCOME' ? '+' : '-'}Rs. {t.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-right space-x-2">
                <button onClick={() => handleEditInit(t)} className="text-indigo-600 hover:text-indigo-900 font-medium text-xs">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-900 font-medium text-xs">Delete</button>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}