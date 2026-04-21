'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import PortalLayout from '../PortalLayout'

export default function PatientMessages() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [nurses, setNurses] = useState<any[]>([])
  const [selectedNurse, setSelectedNurse] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) { router.push('/login'); return }
      setUser(d.user)
    })
    // Get nurses to message
    fetch('/api/messages/contacts').then(r => r.json()).then(d => setNurses(d.contacts || []))
  }, [router])

  useEffect(() => {
    if (!selectedNurse) return
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [selectedNurse])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = () => {
    if (!selectedNurse) return
    fetch(`/api/messages?with=${selectedNurse.id}`).then(r => r.json()).then(d => setMessages(d.messages || []))
  }

  const sendMessage = async () => {
    if (!input.trim() || !selectedNurse) return
    setSending(true)
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: selectedNurse.id, content: input }),
    })
    setInput('')
    setSending(false)
    fetchMessages()
  }

  return (
    <PortalLayout user={user}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">💬 Messages</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex h-[600px] overflow-hidden">
        {/* Contacts */}
        <div className="w-64 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Clinic Staff</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {nurses.length === 0 ? (
              <p className="text-xs text-gray-500 p-4">No staff available</p>
            ) : (
              nurses.map((nurse: any) => (
                <button key={nurse.id} onClick={() => setSelectedNurse(nurse)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left ${selectedNurse?.id === nurse.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''}`}>
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                    {nurse.name[0]}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">{nurse.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{nurse.role}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          {!selectedNurse ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-5xl mb-3">💬</div>
                <p className="text-sm">Select a staff member to start messaging</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                  {selectedNurse.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{selectedNurse.name}</p>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-8">No messages yet. Say hello! 👋</p>
                )}
                {messages.map((msg: any) => {
                  const isMine = msg.senderId === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
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
    </PortalLayout>
  )
}
