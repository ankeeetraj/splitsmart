'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/app/actions/auth'

export default function AuthForm({ isLogin }) {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.target)

    if (isLogin) {
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.get('email'),
        password: formData.get('password')
      })
      if (res?.error) setError(res.error)
      else router.push('/dashboard')
    } else {
      const res = await registerUser(formData)
      if (res.error) setError(res.error)
      else {
        await signIn('credentials', {
          redirect: false,
          email: formData.get('email'),
          password: formData.get('password')
        })
        router.push('/dashboard')
      }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {error && <div className="text-red-600 font-bold text-sm">{error}</div>}
      {!isLogin && (
        <div>
          <label className="block text-sm font-bold text-positivus-black mb-1">Name</label>
          <input 
            type="text" 
            name="name" 
            required 
            className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-positivus-white text-positivus-black font-medium focus:outline-none focus:ring-2 focus:ring-positivus-green"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-bold text-positivus-black mb-1">Email</label>
        <input 
          type="email" 
          name="email" 
          required 
          className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-positivus-white text-positivus-black font-medium focus:outline-none focus:ring-2 focus:ring-positivus-green"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-positivus-black mb-1">Password</label>
        <input 
          type="password" 
          name="password" 
          required 
          className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-positivus-white text-positivus-black font-medium focus:outline-none focus:ring-2 focus:ring-positivus-green"
        />
      </div>
      {!isLogin && (
        <div>
          <label className="block text-sm font-bold text-positivus-black mb-1">UPI ID (Optional)</label>
          <input 
            type="text" 
            name="upi_id" 
            className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-positivus-white text-positivus-black font-medium focus:outline-none focus:ring-2 focus:ring-positivus-green"
          />
        </div>
      )}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-positivus-black text-positivus-white border-2 border-positivus-black rounded-xl px-6 py-3 font-bold mt-6 hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
      </button>
    </form>
  )
}
