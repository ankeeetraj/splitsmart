import { sql } from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { createGroup } from '@/app/actions/group'

export default async function NewGroupPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div className="bg-positivus-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl border-2 border-positivus-black rounded-[14px] p-10 bg-positivus-white">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-positivus-black">Create a Group</h1>
            <p className="text-positivus-black mt-2 font-medium">Set up a new space to split expenses.</p>
          </div>
          
          <form action={createGroup} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-positivus-black mb-1">Group Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-positivus-white text-positivus-black font-medium focus:outline-none focus:ring-2 focus:ring-positivus-green"
                placeholder="e.g. Goa Trip 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-positivus-black mb-1">Group Type</label>
              <select 
                name="type" 
                required 
                className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-positivus-white text-positivus-black font-medium focus:outline-none focus:ring-2 focus:ring-positivus-green appearance-none"
              >
                <option value="trip">Trip</option>
                <option value="flatmates">Flatmates</option>
                <option value="outing">Outing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-positivus-black mb-1">Invite Members (Emails, comma separated)</label>
              <textarea 
                name="members" 
                rows="3"
                className="w-full border-2 border-positivus-black rounded-[10px] px-4 py-3 bg-positivus-white text-positivus-black font-medium focus:outline-none focus:ring-2 focus:ring-positivus-green resize-none"
                placeholder="friend@example.com, roommate@example.com"
              />
            </div>

            <div className="flex gap-4 mt-8">
              <Link href="/dashboard" className="flex-1 bg-positivus-white text-positivus-black border-2 border-positivus-black rounded-xl px-6 py-3 font-bold text-center hover:bg-positivus-black hover:text-positivus-white transition-colors">
                Cancel
              </Link>
              <button type="submit" className="flex-1 bg-positivus-black text-positivus-white border-2 border-positivus-black rounded-xl px-6 py-3 font-bold hover:opacity-80 transition-opacity">
                Create Group
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
