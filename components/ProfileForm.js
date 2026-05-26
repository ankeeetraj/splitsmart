'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/app/actions/profile'

export default function ProfileForm({ user }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.target)
    const res = await updateProfile(formData)

    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 text-[#cc3333] border-2 border-[#cc3333] rounded-[10px] font-bold text-sm bg-red-50">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 text-[#228833] border-2 border-[#228833] rounded-[10px] font-bold text-sm bg-green-50">
          Profile updated successfully!
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-positivus-black mb-1">Name</label>
        <input 
          type="text" 
          value={user.name}
          readOnly
          className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-gray-100 text-[#444444] font-medium focus:outline-none cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-positivus-black mb-1">Email</label>
        <input 
          type="email" 
          value={user.email}
          readOnly
          className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-gray-100 text-[#444444] font-medium focus:outline-none cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-positivus-black mb-1">UPI ID</label>
        <input 
          type="text" 
          name="upi_id"
          defaultValue={user.upi_id || ''}
          placeholder="e.g. name@okhdfcbank"
          className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-positivus-white text-positivus-black font-medium focus:outline-none focus:ring-2 focus:ring-positivus-green"
        />
        <p className="text-sm font-medium text-[#777777] mt-2">
          Add your UPI ID so others can easily pay you back.
        </p>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-positivus-black text-positivus-white border-2 border-positivus-black rounded-xl px-6 py-3 font-bold mt-6 hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
