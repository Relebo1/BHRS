'use client'

import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth()
  const [contacts, setContacts] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    fetch('/api/messages/contacts').then(r => r.json()).then(d => setContacts(d.contacts || []))
  }, [user])

  useEffect(() => {
    if (!selected) return
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [selected])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = () => {
    if (!selected) return
    fetch(`/api/messages?with=${selected.id}`).then(r => r.json()).then(d => setMessages(d.messages || []))
  }

  const sendMessage = async () => {
    if (!input.trim() || !selected) return
    setSending(true)
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: selected.id, content: input }),
    })
    setInput('')
    setSending(false)
    fetchMessages()
  }

  if (authLoading) return null

  return (
    <DashboardLayout title="Messages" userName={user?.name} userRole={user?.role}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">💬 Patient Messages</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex h-[600px] overflow-hidden">
        {/* Contacts */}
        <div className="w-72 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Patients ({contacts.length})</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.length === 0 ? (
              <p className="text-xs text-gray-500 p-4">No patients with accounts yet</p>
            ) : (
              contacts.map((c: any) => (
                <button key={c.id} onClick={() => setSelected(c)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left ${selected?.id === c.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''}`}>
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm flex-shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                    {c.studentId && <p className="text-xs text-gray-500">{c.studentId}</p>}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-5xl mb-3">💬</div>
                <p className="text-sm">Select a patient to start messaging</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                  {selected.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{selected.name}</p>
                  {selected.studentId && <p className="text-xs text-gray-500">{selected.studentId}</p>}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-8">No messages yet.</p>
                )}
                {messages.map((msg: any) => {
                  const isMine = msg.senderId === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                        isMine ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMine ? 'text-primary-200' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
                <button onClick={sendMessage} disabled={!input.trim() || sending}
                  className="bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-primary-700 transition-colors">
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
