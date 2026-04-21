'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import { useAuth } from '@/hooks/useAuth'

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'nurse' })

  const fetchUsers = () => {
    fetch('/api/users').then(r => r.json()).then(data => setUsers(data.users || [])).finally(() => setLoading(false))
  }

  useEffect(() => { if (user) fetchUsers() }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error || 'Failed to create user'); return }
    setShowModal(false)
    setForm({ name: '', email: '', password: '', role: 'nurse' })
    fetchUsers()
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role', label: 'Role',
      render: (v: string) => {
        const colors: any = { admin: 'badge-danger', nurse: 'badge-success' }
        return <span className={`badge ${colors[v] || 'badge-info'} capitalize`}>{v}</span>
      }
    },
    { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
  ]

  if (authLoading) return null

  return (
    <DashboardLayout title="User Management" userName={user?.name} userRole={user?.role}>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Staff Management</h1>
          <p className="text-gray-600">Manage clinic staff accounts (admins and nurses)</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2 w-fit">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Staff', count: users.length, color: 'primary' },
          { label: 'Admins', count: users.filter((u: any) => u.role === 'admin').length, color: 'red' },
          { label: 'Nurses', count: users.filter((u: any) => u.role === 'nurse').length, color: 'green' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`card border-l-4 border-${color}-500`}>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{count}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Staff</h3>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <Table columns={columns} data={users} />
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Staff Member"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleSubmit} className="btn btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create'}</button>
          </>
        }
      >
        <form className="space-y-4">
          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="form-label">Full Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" required />
          </div>
          <div>
            <label className="form-label">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-input" required />
          </div>
          <div>
            <label className="form-label">Password *</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="form-input" required />
          </div>
          <div>
            <label className="form-label">Role *</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="form-select">
              <option value="nurse">Nurse</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
