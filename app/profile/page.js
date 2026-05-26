import { sql } from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const users = await sql`
    SELECT id, name, email, upi_id FROM users WHERE id = ${session.user.id}
  `
  if (users.length === 0) redirect('/login')
  
  const user = users[0]

  return (
    <div className="bg-positivus-white min-h-screen flex flex-col font-sans">
      <Navbar />
      
      <main className="max-w-[1100px] mx-auto w-full flex-1 px-[60px]">
        <div className="py-[32px] border-b-2 border-positivus-black">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-[40px] font-extrabold text-positivus-black leading-tight">Your Profile</h1>
            <p className="text-[#444444] font-medium mt-2">Manage your personal information.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-7">
          <div className="mx-10 my-[28px] border-2 border-positivus-black rounded-[14px] p-[32px] bg-positivus-white max-w-xl">
            <ProfileForm user={user} />
          </div>
        </div>
      </main>
    </div>
  )
}
