'use client'

import { useState } from 'react'

export default function RatingWidget({ onClose }: { onClose: () => void }) {
  const [score, setScore] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    if (!score) return
    setLoading(true)
    await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, comment }),
    })
    setLoading(false)
    setDone(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {done ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-gray-900">Thank you for your feedback!</h3>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Rate BHRS</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <p className="text-gray-600 mb-6 text-sm">How would you rate your experience with the Botho Health Records System?</p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star}
                  onClick={() => setScore(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  {star <= (hover || score) ? '⭐' : '☆'}
                </button>
              ))}
            </div>

            {score > 0 && (
              <p className="text-center text-sm font-medium text-gray-700 mb-4">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][score]}
              </p>
            )}

            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Optional: share your thoughts..."
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-primary-500 mb-4"
              rows={3}
            />

            <button onClick={submit} disabled={!score || loading}
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-all hover:shadow-lg">
              {loading ? 'Submitting...' : 'Submit Rating'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
