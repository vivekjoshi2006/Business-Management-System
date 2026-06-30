"use client";

import React, { useEffect, useState } from 'react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  category: string;
  notes?: string;
}

export default function ContactDirectory() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('Lead');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      const data = (await res.json()) as Contact[];
      setContacts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInit = (contact: Contact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setEmail(contact.email || '');
    setCompany(contact.company || '');
    setCategory(contact.category);
    setNotes(contact.notes || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setEmail('');
    setCompany('');
    setCategory('Lead');
    setNotes('');
  };

  const handleDelete = async (id: string) => {
    const isClient = typeof globalThis !== 'undefined' && 'confirm' in globalThis;

    if (isClient) {
      const confirmed = (globalThis as any).confirm('Are you sure you want to delete this contact?');
      if (!confirmed) return;
    } else {
      return;
    }

    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchContacts();
        if (editingId === id) handleCancelEdit();
      } else {
        if (typeof globalThis !== 'undefined' && 'alert' in globalThis) {
          (globalThis as any).alert('Failed to delete contact item.');
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // Validate phone length on submit
  if (phone.length !== 10) {
    // SSR safe alert check
    if (typeof globalThis !== 'undefined' && 'alert' in globalThis) {
      (globalThis as any).alert("Phone number must be exactly 10 digits.");
    }
    return;
  }

  try {
    const url = editingId ? `/api/contacts/${editingId}` : '/api/contacts';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, company, category, notes }),
    });
    
    if (res.ok) {
      handleCancelEdit();
      fetchContacts();
    } else {
      const errData = await res.json() as { error?: string };
      // SSR safe alert check
      if (typeof globalThis !== 'undefined' && 'alert' in globalThis) {
        (globalThis as any).alert(errData.error || 'Failed to save contact.');
      }
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Contact Directory</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Name *</label>
          <input value={name} onChange={(e: any) => setName(e.target.value)} className="border p-2 rounded w-full text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Phone *</label>
          <input
            type="text" inputMode="numeric" maxLength={10} value={phone}
            onChange={(e: any) => {
              // Automatically filters out any character that is not a digit (0-9)
              const val = e.target.value.replace(/[^0-9]/g, '');
              setPhone(val);
            }}
            placeholder="e.g. 9876543210" className="border p-2 rounded w-full text-sm" required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Email</label>
          <input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} className="border p-2 rounded w-full text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Company</label>
          <input value={company} onChange={(e: any) => setCompany(e.target.value)} className="border p-2 rounded w-full text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Category *</label>
          <select value={category} onChange={(e: any) => setCategory(e.target.value)} className="border p-2.5 rounded w-full text-sm">
            <option value="Lead">Lead</option>
            <option value="Partner">Partner</option>
            <option value="Customer">Customer</option>
            <option value="Personal">Personal</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Notes</label>
          <input value={notes} onChange={(e: any) => setNotes(e.target.value)} className="border p-2 rounded w-full text-sm" />
        </div>
        <div className="md:col-span-3 flex justify-end gap-2">
          <Button type="submit">{editingId ? 'Update Contact' : 'Add New Contact'}</Button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-sm transition">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="text-center py-6 text-gray-500">Loading directory...</div>
      ) : (
        <Table headers={['Name', 'Category', 'Phone', 'Email', 'Company', 'Notes', 'Actions']}>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{contact.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${contact.category === 'Lead' ? 'bg-yellow-100 text-yellow-800' :
                    contact.category === 'Partner' ? 'bg-blue-100 text-blue-800' :
                      contact.category === 'Customer' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                  }`}>
                  {contact.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{contact.phone}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{contact.email || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{contact.company || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{contact.notes || '-'}</td>
              <td className="px-6 py-4 text-sm text-right space-x-2">
                <button onClick={() => handleEditInit(contact)} className="text-indigo-600 hover:text-indigo-900 font-medium text-xs">Edit</button>
                <button onClick={() => handleDelete(contact.id)} className="text-red-600 hover:text-red-900 font-medium text-xs">Delete</button>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}