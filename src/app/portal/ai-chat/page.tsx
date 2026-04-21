'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import PortalLayout from '../PortalLayout'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function AiChat() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: `Hello! 👋 I'm the BHRS Health Assistant.\n\nI can help you understand basic symptoms and give general health advice.\n\nTry asking about: **headache, fever, cough, sore throat, stomach pain, dizziness, rash, fatigue, back pain, anxiety**, and more.\n\n⚠️ *I am not a substitute for professional medical advice. Always consult a nurse for proper diagnosis.*` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) { router.push('/login'); return }
      setUser(d.user)
    })
  }, [router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg }),
    })
    const data = await res.json()
    setLoading(false)
    setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, I could not process that.' }])
  }

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
      return <p key={i} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: formatted }} />
    })
  }

  return (
    <PortalLayout user={user}>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">🤖 Health Assistant</h1>
      <p className="text-gray-600 text-sm mb-6">Ask about symptoms and get general health guidance.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-primary-50 to-purple-50 rounded-t-2xl">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg">🤖</div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">BHRS Health Assistant</p>
            <p className="text-xs text-green-500">● Always available</p>
          </div>
          <div className="ml-auto bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium">
            ⚠️ Not a medical diagnosis
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm mr-2 flex-shrink-0 mt-1">🤖</div>
              )}
              <div className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-900 rounded-bl-sm'
              }`}>
                {formatMessage(msg.content)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm mr-2">🤖</div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Describe your symptoms..."
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
            <button onClick={sendMessage} disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:shadow-md transition-all">
              Send
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">For emergencies, visit the clinic immediately or call emergency services.</p>
        </div>
      </div>
    </PortalLayout>
  )
}
