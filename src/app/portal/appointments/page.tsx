'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PortalLayout from '../PortalLayout'

export default function PatientAppointments() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [slots, setSlots] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) { router.push('/login'); return }
      setUser(d.user)
    })
    fetchAppointments()
  }, [router])

  const fetchAppointments = () => {
    fetch('/api/appointments').then(r => r.json()).then(d => {
      setAppointments(d.appointments || [])
      setLoading(false)
    })
  }

  const fetchSlots = (date: string) => {
    setSelectedDate(date)
    setSelectedSlot('')
    if (!date) return
    fetch(`/api/appointments/slots?date=${date}`).then(r => r.json()).then(d => setSlots(d.slots || []))
  }

  const handleBook = async () => {
    if (!selectedSlot) return
    setBooking(true)
    setError('')
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointmentDate: selectedSlot, notes }),
    })
    const data = await res.json()
    setBooking(false)
    if (!res.ok) { setError(data.error || 'Booking failed'); return }
    setSuccess('Appointment booked successfully!')
    setSelectedDate('')
    setSelectedSlot('')
    setNotes('')
    setSlots([])
    fetchAppointments()
    setTimeout(() => setSuccess(''), 4000)
  }

  const handleCancel = async (id: number) => {
    await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    fetchAppointments()
  }

  const today = new Date().toISOString().split('T')[0]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  )

  return (
    <PortalLayout user={user}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h1>

      {/* Book new */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">📅 Book New Appointment</h2>

        {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">{success}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <input type="date" min={today} value={selectedDate}
              onChange={e => fetchSlots(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Reason for visit..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-500 text-sm" />
          </div>
        </div>

        {selectedDate && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots</label>
            {slots.length === 0 ? (
              <p className="text-sm text-gray-500">No available slots for this date.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((slot: any) => (
                  <button key={slot.time}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      !slot.available ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed' :
                      selectedSlot === slot.time ? 'border-primary-500 bg-primary-600 text-white' :
                      'border-gray-200 bg-white text-gray-700 hover:border-primary-400'
                    }`}
                  >
                    {slot.label} {!slot.available && '(Taken)'}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button onClick={handleBook} disabled={!selectedSlot || booking}
          className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm disabled:opacity-50 hover:shadow-md transition-all">
          {booking ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>

      {/* Existing appointments */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4">My Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No appointments yet.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt: any) => (
              <div key={apt.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-2xl">📅</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {new Date(apt.appointmentDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  {apt.notes && <p className="text-xs text-gray-600 mt-0.5">Note: {apt.notes}</p>}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                  apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>{apt.status}</span>
                {apt.status === 'scheduled' && (
                  <button onClick={() => handleCancel(apt.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium">Cancel</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
