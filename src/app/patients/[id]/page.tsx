'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import Modal from '@/components/Modal'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeftIcon, PencilIcon, PlusIcon, UserIcon, PhoneIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline'

export default function PatientProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const { id } = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newRecord, setNewRecord] = useState({ diagnosis: '', treatment: '', prescription: '', visitDate: '' })

  useEffect(() => {
    if (!user) return
    fetch(`/api/patients/${id}`)
      .then(r => r.json())
      .then(data => setPatient(data.patient))
      .finally(() => setLoading(false))
  }, [user, id])

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/medical-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newRecord, patientId: Number(id) })
    })
    setSaving(false)
    setShowModal(false)
    setNewRecord({ diagnosis: '', treatment: '', prescription: '', visitDate: '' })
    // Refresh patient data
    fetch(`/api/patients/${id}`).then(r => r.json()).then(data => setPatient(data.patient))
  }

  if (authLoading || loading) return (
    <DashboardLayout title="Patient Profile" userName="" userRole="">
      <div className="flex justify-center h-64 items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    </DashboardLayout>
  )

  if (!patient) return (
    <DashboardLayout title="Patient Profile" userName={user?.name} userRole={user?.role}>
      <p className="text-gray-600">Patient not found.</p>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Patient Profile" userName={user?.name} userRole={user?.role}>
      <div className="mb-6">
        <Link href="/patients" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeftIcon className="w-5 h-5" /> Back to Patients
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{patient.firstName} {patient.lastName}</h2>
            <p className="text-gray-600 mb-4">{patient.studentId}</p>
            <span className={`badge ${patient.gender === 'Male' ? 'badge-info' : 'badge-primary'}`}>{patient.gender}</span>
            <div className="mt-4">
              <Link href={`/patients/${id}/edit`} className="btn btn-primary w-full flex items-center justify-center gap-2">
                <PencilIcon className="w-4 h-4" /> Edit Profile
              </Link>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{patient.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">{patient.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium text-gray-900">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medical History */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
              <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
                <PlusIcon className="w-5 h-5" /> Add Record
              </button>
            </div>
            {patient.medicalRecords?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No medical records yet.</p>
            ) : (
              <div className="space-y-4">
                {patient.medicalRecords?.map((record: any) => (
                  <div key={record.id} className="border-l-4 border-primary-500 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{record.diagnosis}</h4>
                      <span className="text-sm text-gray-500">{new Date(record.visitDate).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600"><span className="font-medium">Treatment:</span> {record.treatment}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Prescription:</span> {record.prescription}</p>
                    <p className="text-sm text-gray-500 mt-1">Dr. {record.doctor?.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointments */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
              <Link href="/appointments/add" className="btn btn-secondary flex items-center gap-2">
                <PlusIcon className="w-5 h-5" /> Schedule
              </Link>
            </div>
            {patient.appointments?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments yet.</p>
            ) : (
              <div className="space-y-3">
                {patient.appointments?.map((apt: any) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{apt.notes || 'Appointment'}</p>
                        <p className="text-sm text-gray-600">{new Date(apt.appointmentDate).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`badge ${apt.status === 'scheduled' ? 'badge-info' : apt.status === 'completed' ? 'badge-success' : 'badge-danger'}`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Medical Record"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleAddRecord} className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Record'}
            </button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="form-label">Visit Date *</label>
            <input type="date" value={newRecord.visitDate} onChange={e => setNewRecord({ ...newRecord, visitDate: e.target.value })} className="form-input" required />
          </div>
          <div>
            <label className="form-label">Diagnosis *</label>
            <input type="text" value={newRecord.diagnosis} onChange={e => setNewRecord({ ...newRecord, diagnosis: e.target.value })} className="form-input" required />
          </div>
          <div>
            <label className="form-label">Treatment *</label>
            <textarea value={newRecord.treatment} onChange={e => setNewRecord({ ...newRecord, treatment: e.target.value })} className="form-textarea" rows={3} required />
          </div>
          <div>
            <label className="form-label">Prescription</label>
            <textarea value={newRecord.prescription} onChange={e => setNewRecord({ ...newRecord, prescription: e.target.value })} className="form-textarea" rows={2} />
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
