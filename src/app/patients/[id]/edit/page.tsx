'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function EditPatientPage() {
  const { user, loading: authLoading } = useAuth()
  const { id } = useParams()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    if (!user) return
    fetch(`/api/patients/${id}`)
      .then(r => r.json())
      .then(data => {
        const p = data.patient
        if (p) {
          setForm({
            firstName: p.firstName,
            lastName: p.lastName,
            gender: p.gender,
            dateOfBirth: p.dateOfBirth?.split('T')[0] || '',
            phone: p.phone,
            address: p.address,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [user, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const res = await fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) { setError(data.error || 'Failed to update patient'); return }
    router.push(`/patients/${id}`)
  }

  if (authLoading || loading) return (
    <DashboardLayout title="Edit Patient" userName="" userRole="">
      <div className="flex justify-center h-64 items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Edit Patient" userName={user?.name} userRole={user?.role}>
      <div className="mb-8">
        <Link href={`/patients/${id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeftIcon className="w-5 h-5" /> Back to Patient
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Patient</h1>
        <p className="text-gray-600">Update patient information</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">First Name *</label>
                <input type="text" value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  className="form-input" required />
              </div>
              <div>
                <label className="form-label">Last Name *</label>
                <input type="text" value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  className="form-input" required />
              </div>
              <div>
                <label className="form-label">Gender *</label>
                <select value={form.gender}
                  onChange={e => setForm({ ...form, gender: e.target.value })}
                  className="form-select" required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Date of Birth *</label>
                <input type="date" value={form.dateOfBirth}
                  onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                  className="form-input" required />
              </div>
              <div>
                <label className="form-label">Phone *</label>
                <input type="tel" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="form-input" required />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Address *</label>
                <textarea value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="form-textarea" rows={3} required />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link href={`/patients/${id}`} className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>

        <div className="card bg-yellow-50 border border-yellow-100 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Note</h3>
          <p className="text-sm text-gray-700">Student ID cannot be changed after registration. Contact an administrator if a correction is needed.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
