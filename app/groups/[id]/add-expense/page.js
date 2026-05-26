import { sql } from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import AddExpenseForm from '@/components/AddExpenseForm'

export default async function AddExpensePage({ params }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const { id } = params

  const members = await sql`
    SELECT u.id, u.name 
    FROM users u
    JOIN group_members gm ON u.id = gm.user_id
    WHERE gm.group_id = ${id}
  `

  return (
    <div className="bg-positivus-white min-h-screen flex flex-col font-sans">
      <Navbar />
      
      <main className="max-w-[1100px] mx-auto w-full flex-1 px-[60px]">
        <div className="py-[32px] border-b-2 border-positivus-black">
          <div className="mx-auto">
            <h1 className="text-[40px] font-extrabold text-positivus-black leading-tight">Add Expense</h1>
          </div>
        </div>
        
        <div className="py-[28px] mx-auto">
          <AddExpenseForm groupId={id} members={members} />
        </div>
      </main>
    </div>
  )
}
