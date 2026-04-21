'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function AddPatientPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    studentId: '', firstName: '', lastName: '', gender: 'Male',
    dateOfBirth: '', phone: '', address: '', email: '', password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) { setError(data.error || 'Failed to save patient'); return }

    setSuccess(`Patient created! Login: ${data.userEmail} / ${form.password || form.studentId}`)
    setTimeout(() => router.push(`/patients/${data.patient.id}`), 3000)
  }

  if (authLoading) return null

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout title="Add Patient" userName={user?.name} userRole={user?.role}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Only</h2>
            <p className="text-gray-600">Only administrators can add new patients.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Add Patient" userName={user?.name} userRole={user?.role}>
      <div className="mb-8">
        <Link href="/patients" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm">
          ← Back to Patients
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Register New Patient</h1>
        <p className="text-gray-600 text-sm">Creates a patient record and a login account for the patient portal.</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Student ID *</label>
                  <input type="text" name="studentId" value={form.studentId} onChange={handleChange} className="form-input" placeholder="STU001" required />
                </div>
                <div>
                  <label className="form-label">Gender *</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className="form-select" required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">First Name *</label>
                  <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="form-input" placeholder="Thabo" required />
                </div>
                <div>
                  <label className="form-label">Last Name *</label>
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="form-input" placeholder="Mokoena" required />
                </div>
                <div>
                  <label className="form-label">Date of Birth *</label>
                  <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+267 71234567" required />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Address *</label>
                  <textarea name="address" value={form.address} onChange={handleChange} className="form-textarea" rows={2} placeholder="Block 8, Gaborone" required />
                </div>
              </div>
            </div>

            <div className="card border-l-4 border-primary-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Portal Login</h3>
              <p className="text-sm text-gray-600 mb-5">These credentials allow the patient to log in to their portal. Default password is their Student ID if left blank.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" placeholder="student@botho.ac.bw" required />
                </div>
                <div>
                  <label className="form-label">Password (optional)</label>
                  <input type="text" name="password" value={form.password} onChange={handleChange} className="form-input" placeholder={`Default: ${form.studentId || 'Student ID'}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card bg-blue-50 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">ℹ️ What happens next?</h3>
              <ul className="space-y-2 text-xs text-gray-700">
                <li>✅ Patient record is created</li>
                <li>✅ Login account is created</li>
                <li>✅ Nurses are notified</li>
                <li>✅ Patient can log in to portal</li>
                <li>✅ Patient can book appointments</li>
                <li>✅ Patient can message nurses</li>
              </ul>
            </div>
            <div className="card">
              <button type="submit" className="w-full btn btn-primary mb-3" disabled={saving}>
                {saving ? 'Creating...' : 'Register Patient'}
              </button>
              <Link href="/patients" className="w-full btn btn-secondary block text-center">Cancel</Link>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}
