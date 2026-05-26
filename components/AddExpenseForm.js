'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addExpense } from '@/app/actions/expense'
import Link from 'next/link'

export default function AddExpenseForm({ groupId, members }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [splitType, setSplitType] = useState('equal')
  const [amount, setAmount] = useState('')
  const [customSplits, setCustomSplits] = useState({})

  function handleCustomSplitChange(userId, val) {
    setCustomSplits(prev => ({...prev, [userId]: val}))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.target)
    
    if (splitType === 'custom') {
      const totalCustom = Object.values(customSplits).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
      if (Math.abs(totalCustom - parseFloat(amount)) > 0.01) {
        setError(`Custom splits (₹${totalCustom}) must equal total amount (₹${amount})`)
        setLoading(false)
        return
      }
    }

    const res = await addExpense(groupId, formData, splitType === 'custom' ? customSplits : null)
    
    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.push(`/groups/${groupId}`)
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto border-2 border-positivus-black rounded-[14px] p-8 md:p-[32px] bg-positivus-white">
      {error && (
        <div className="mb-6 p-4 text-[#cc3333] border-2 border-[#cc3333] rounded-[10px] font-bold text-sm bg-red-50">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-positivus-black mb-1">Title</label>
          <input 
            name="title"
            type="text" 
            required
            className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-positivus-white text-positivus-black font-medium focus:outline-none focus:ring-2 focus:ring-positivus-green"
            placeholder="e.g. Dinner at Joe's"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-bold text-positivus-black mb-1">Amount (₹)</label>
            <input 
              name="amount"
              type="number"
              step="0.01" 
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-positivus-white text-positivus-black font-medium focus:outline-none focus:ring-2 focus:ring-positivus-green"
              placeholder="0.00"
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-bold text-positivus-black mb-1">Category</label>
            <select 
              name="category"
              required
              className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-positivus-white text-positivus-black font-medium focus:outline-none focus:ring-2 focus:ring-positivus-green appearance-none"
            >
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="stay">Stay</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-positivus-black mb-1">Paid By</label>
          <select 
            name="paid_by_user_id"
            required
            className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-positivus-white text-positivus-black font-medium focus:outline-none focus:ring-2 focus:ring-positivus-green appearance-none"
          >
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-positivus-black mb-2">Split Type</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setSplitType('equal')}
              className={`flex-1 px-[18px] py-[6px] rounded-full border-2 border-positivus-black font-bold text-sm transition-colors ${splitType === 'equal' ? 'bg-positivus-black text-positivus-white' : 'bg-positivus-white text-positivus-black hover:bg-gray-50'}`}
            >
              Equal
            </button>
            <button
              type="button"
              onClick={() => setSplitType('custom')}
              className={`flex-1 px-[18px] py-[6px] rounded-full border-2 border-positivus-black font-bold text-sm transition-colors ${splitType === 'custom' ? 'bg-positivus-black text-positivus-white' : 'bg-positivus-white text-positivus-black hover:bg-gray-50'}`}
            >
              Custom
            </button>
          </div>
          <input type="hidden" name="split_type" value={splitType} />
        </div>

        {splitType === 'custom' && (
          <div className="border-2 border-positivus-black rounded-[14px] p-6 space-y-4 bg-[#F8F8F8]">
            <p className="text-sm font-bold text-positivus-black">Enter amount owed per person:</p>
            {members.map(m => (
              <div key={m.id} className="flex items-center gap-4">
                <span className="flex-1 text-sm font-bold text-positivus-black">{m.name}</span>
                <input 
                  type="number"
                  step="0.01"
                  className="w-32 border-2 border-positivus-black rounded-[10px] px-4 py-2 bg-positivus-white text-positivus-black font-medium focus:outline-none focus:ring-2 focus:ring-positivus-green"
                  placeholder="0.00"
                  value={customSplits[m.id] || ''}
                  onChange={(e) => handleCustomSplitChange(m.id, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Link href={`/groups/${groupId}`} className="flex-1 bg-positivus-white text-positivus-black border-2 border-positivus-black rounded-xl px-6 py-3 font-bold text-center hover:bg-[#F8F8F8] transition-colors">
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 bg-positivus-black text-positivus-white border-2 border-positivus-black rounded-xl px-6 py-3 font-bold text-center hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Expense →'}
          </button>
        </div>
      </form>
    </div>
  )
}
