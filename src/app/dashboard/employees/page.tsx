"use client";

import React, { useEffect, useState } from 'react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  salary: number;
}

export default function EmployeeTracker() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('STAFF');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      const data = (await res.json()) as Employee[];
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInit = (emp: Employee) => {
    setEditingId(emp.id);
    setFirstName(emp.firstName);
    setLastName(emp.lastName);
    setEmail(emp.email);
    setPhone(emp.phone);
    setRole(emp.role);
    setDepartment(emp.department);
    setSalary(String(emp.salary));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setRole('STAFF');
    setDepartment('');
    setSalary('');
  };

  const handleDelete = async (id: string) => {
    const isClient = typeof globalThis !== 'undefined' && 'confirm' in globalThis;

    if (isClient) {
      const confirmed = (globalThis as any).confirm('Are you sure you want to delete this employee?');
      if (!confirmed) return;
    } else {
      return;
    }

    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEmployees();
        if (editingId === id) handleCancelEdit();
      } else {
        if (typeof globalThis !== 'undefined' && 'alert' in globalThis) {
          (globalThis as any).alert('Failed to delete employee profile.');
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (phone.length !== 10) {
      if (typeof globalThis !== 'undefined' && 'alert' in globalThis) {
        (globalThis as any).alert("Phone number must be exactly 10 digits.");
      }
      return;
    }

    try {
      const url = editingId ? `/api/employees/${editingId}` : '/api/employees';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, role, department, salary }),
      });
      if (res.ok) {
        handleCancelEdit();
        fetchEmployees();
      } else {
        const errData = await res.json() as { error?: string };
        if (typeof globalThis !== 'undefined' && 'alert' in globalThis) {
          (globalThis as any).alert(errData.error || 'Failed to save employee.');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Employee Tracker</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">First Name *</label>
          <input value={firstName} onChange={(e: any) => setFirstName(e.target.value)} className="border p-2 rounded w-full text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Last Name *</label>
          <input value={lastName} onChange={(e: any) => setLastName(e.target.value)} className="border p-2 rounded w-full text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Email *</label>
          <input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} className="border p-2 rounded w-full text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Phone *</label>
          <input type="text" inputMode="numeric" maxLength={10} value={phone}
            onChange={(e: any) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              setPhone(val);
            }}
            placeholder="e.g. 9876543210" className="border p-2 rounded w-full text-sm" required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Department *</label>
          <input value={department} onChange={(e: any) => setDepartment(e.target.value)} className="border p-2 rounded w-full text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Role *</label>
          <select value={role} onChange={(e: any) => setRole(e.target.value)} className="border p-2.5 rounded w-full text-sm">
            <option value="STAFF">Staff</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Annual Salary (Rs.) *</label>
          <input type="number" value={salary} onChange={(e: any) => setSalary(e.target.value)} className="border p-2 rounded w-full text-sm" required />
        </div>
        <div className="md:col-span-3 flex justify-end gap-2">
          <Button type="submit">{editingId ? 'Update Employee' : 'Onboard Employee'}</Button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-sm transition">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="text-center py-6 text-gray-500">Loading personnel directories...</div>
      ) : (
        <Table headers={['Name', 'Email', 'Role', 'Department', 'Salary', 'Actions']}>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{emp.email}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{emp.role}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{emp.department}</td>
              <td className="px-6 py-4 text-sm text-gray-500">Rs. {emp.salary.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-right space-x-2">
                <button onClick={() => handleEditInit(emp)} className="text-indigo-600 hover:text-indigo-900 font-medium text-xs">Edit</button>
                <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-900 font-medium text-xs">Delete</button>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}