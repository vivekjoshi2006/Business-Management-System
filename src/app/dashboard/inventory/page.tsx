"use client";

import React, { useEffect, useState } from 'react';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Track currently edited SKU Id
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form States
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/inventory');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
        setError('Invalid data structure returned.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to database.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditInit = (item: InventoryItem) => {
    setEditingId(item.id);
    setName(item.name);
    setSku(item.sku);
    setUnitPrice(String(item.unitPrice));
    setQuantity(String(item.quantity));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setSku('');
    setUnitPrice('');
    setQuantity('1');
    setFormError(null);
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
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchInventory();
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
    setFormError(null);

    const parsedPrice = parseFloat(unitPrice) || 0;
    const parsedQuantity = parseInt(quantity, 10) || 1;

    if (parsedPrice < 0 || parsedQuantity < 1) {
      setFormError("Price cannot be negative and Stock must be at least 1.");
      return;
    }

    try {
      const url = editingId ? `/api/inventory/${editingId}` : '/api/inventory';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, sku, unitPrice: parsedPrice, quantity: parsedQuantity }),
      });

      if (res.ok) {
        handleCancelEdit();
        fetchInventory();
      } else {
        const errData = (await res.json()) as { error?: string };
        setFormError(errData.error || 'Operation failed.');
      }
    } catch (err) {
      console.error(err);
      setFormError('Communication error.');
    }
  };

  const totalSkus = items.length;
  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor stock levels, track operational values, and provision catalog listings.</p>
        </div>
        <button onClick={fetchInventory} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm">
          🔄 Refresh Data
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-semibold text-slate-400 uppercase">Total SKUs</p><h3 className="text-2xl font-bold text-slate-800 mt-1">{totalSkus}</h3></div>
          <span className="text-3xl p-3 bg-slate-50 rounded-xl">📦</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-semibold text-slate-400 uppercase">Stock Volume</p><h3 className="text-2xl font-bold text-slate-800 mt-1">{totalStock}</h3></div>
          <span className="text-3xl p-3 bg-slate-50 rounded-xl">📊</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-semibold text-slate-400 uppercase">Total Value</p><h3 className="text-2xl font-bold text-slate-800 mt-1">Rs. {totalValue.toFixed(2)}</h3></div>
          <span className="text-3xl p-3 bg-slate-50 rounded-xl">💰</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Catalog Item' : 'Add Catalog Item'}</h2>
            <p className="text-xs text-slate-500 mt-1">{editingId ? 'Modify details of your selected SKU.' : 'Register a new stock unit with transactional pricing.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-700 rounded-lg">{formError}</div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Item Name *</label>
              <input value={name} onChange={(e: any) => setName(e.target.value)} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-slate-50/50" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">SKU / Code *</label>
              <input value={sku} onChange={(e: any) => setSku(e.target.value)} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-slate-50/50" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Price (Rs.) *</label>
                <input type="number" step="0.01" min="0" value={unitPrice} onChange={(e: any) => setUnitPrice(e.target.value)} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-slate-50/50" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Stock</label>
                <input type="number" min="1" value={quantity} onChange={(e: any) => { const c = e.target.value.replace(/[^0-9]/g, ''); setQuantity(c); }} onBlur={() => { const p = parseInt(quantity, 10); if (isNaN(p) || p < 1) setQuantity('1'); }} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-slate-50/50" />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition shadow-sm">
                {editingId ? 'Update SKU' : 'Add New SKU'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">Current Catalog</h2>
          </div>

          {loading ? (
            <div className="py-20 text-center"><p className="text-xs text-slate-500">Querying database...</p></div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center"><p className="text-xs text-slate-500">No items registered.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">SKU</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Stock</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase">Price</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{item.sku}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-800 font-medium">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 text-right">Rs. {item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-right space-x-2">
                        <button onClick={() => handleEditInit(item)} className="text-indigo-600 hover:text-indigo-900 font-medium text-xs">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 font-medium text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}