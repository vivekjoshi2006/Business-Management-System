"use client";

import React, { useEffect, useState } from 'react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';

interface Partner {
  id: string;
  name: string;
  type: string;
  email?: string;
  phone?: string;
  companyName?: string;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState('CLIENT');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/partners');
      const data = (await res.json()) as Partner[];
      setPartners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInit = (p: Partner) => {
    setEditingId(p.id);
    setName(p.name);
    setType(p.type);
    setEmail(p.email || '');
    setPhone(p.phone || '');
    setCompanyName(p.companyName || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setType('CLIENT');
    setEmail('');
    setPhone('');
    setCompanyName('');
  };

  const handleDelete = async (id: string) => {
    const isClient = typeof globalThis !== 'undefined' && 'confirm' in globalThis;

    if (isClient) {
      const confirmed = (globalThis as any).confirm('Are you sure you want to delete this partner?');
      if (!confirmed) return;
    } else {
      return;
    }

    try {
      const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPartners();
        if (editingId === id) handleCancelEdit();
      } else {
        if (typeof globalThis !== 'undefined' && 'alert' in globalThis) {
          (globalThis as any).alert('Failed to delete partner.');
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (phone && phone.length !== 10) {
      if (typeof globalThis !== 'undefined' && 'alert' in globalThis) {
        (globalThis as any).alert("Phone number must be exactly 10 digits.");
      }
      return;
    }

    try {
      const url = editingId ? `/api/partners/${editingId}` : '/api/partners';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, email, phone, companyName }),
      });
      if (res.ok) {
        handleCancelEdit();
        fetchPartners();
      } else {
        const errData = await res.json() as { error?: string };
        if (typeof globalThis !== 'undefined' && 'alert' in globalThis) {
          (globalThis as any).alert(errData.error || 'Failed to save partner records.');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Clients & Vendors</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Relation Type *</label>
          <select value={type} onChange={(e: any) => setType(e.target.value)} className="border p-2.5 rounded w-full text-sm">
            <option value="CLIENT">Client</option>
            <option value="VENDOR">Vendor</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Full Name *</label>
          <input value={name} onChange={(e: any) => setName(e.target.value)} className="border p-2 rounded w-full text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Company Name</label>
          <input value={companyName} onChange={(e: any) => setCompanyName(e.target.value)} className="border p-2 rounded w-full text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Email</label>
          <input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} className="border p-2 rounded w-full text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Phone Number</label>
          <input type="text" inputMode="numeric" maxLength={10} value={phone}
            onChange={(e: any) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              setPhone(val);
            }}
            placeholder="Enter 10 digits (optional)" className="border p-2 rounded w-full text-sm"
          />
        </div>
        <div className="md:col-span-3 flex justify-end gap-2">
          <Button type="submit">{editingId ? 'Update Partner' : 'Register Partner'}</Button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-sm transition">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="text-center py-6 text-gray-500">Loading profile ledger...</div>
      ) : (
        <Table headers={['Type', 'Name', 'Company', 'Email', 'Phone', 'Actions']}>
          {partners.map((p) => (
            <tr key={p.id}>
              <td className="px-6 py-4 text-sm font-semibold">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.type === 'CLIENT' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                  {p.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{p.companyName || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{p.email || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{p.phone || '-'}</td>
              <td className="px-6 py-4 text-sm text-right space-x-2">
                <button onClick={() => handleEditInit(p)} className="text-indigo-600 hover:text-indigo-900 font-medium text-xs">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900 font-medium text-xs">Delete</button>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}