import { sql } from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function GroupPage({ params }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const { id } = params

  const groups = await sql`
    SELECT * FROM groups WHERE id = ${id}
  `
  if (groups.length === 0) redirect('/dashboard')
  const group = groups[0]

  const members = await sql`
    SELECT u.id, u.name, u.email
    FROM users u
    JOIN group_members gm ON u.id = gm.user_id
    WHERE gm.group_id = ${id}
  `

  const expenses = await sql`
    SELECT e.*, u.name as paid_by_name
    FROM expenses e
    JOIN users u ON e.paid_by_user_id = u.id
    WHERE e.group_id = ${id}
    ORDER BY e.created_at DESC
  `
  
  const totalAmount = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)

  return (
    <div className="bg-positivus-white min-h-screen flex flex-col font-sans">
      <Navbar groupName={group.name} />
      
      <main className="max-w-[1100px] mx-auto w-full flex-1 flex flex-col relative pb-32 px-[60px]">
        
        {/* Header */}
        <div className="py-12 border-b-2 border-positivus-black">
          <h1 className="text-[48px] font-extrabold text-positivus-black leading-tight mb-8">{group.name}</h1>
          <div className="flex flex-wrap gap-6">
            {members.map((m, i) => {
              const isYou = m.id === session.user.id
              const bgCol = isYou ? 'bg-positivus-white' : (i % 2 === 0 ? 'bg-positivus-green' : 'bg-positivus-black')
              const txtCol = isYou ? 'text-positivus-black' : (i % 2 === 0 ? 'text-positivus-black' : 'text-positivus-white')

              return (
                <div key={m.id} className="flex flex-col items-center gap-3">
                  <div className={`w-[56px] h-[56px] rounded-full border-2 border-positivus-black ${bgCol} flex items-center justify-center text-[16px] font-bold ${txtCol} uppercase`}>
                    {m.name.substring(0, 2)}
                  </div>
                  <span className="text-[14px] font-medium text-positivus-black">{m.name.split(' ')[0]}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Row */}
        <div className="py-6 border-b-2 border-positivus-black flex items-center justify-between bg-positivus-white sticky top-[82px] z-40">
          <div className="text-[17px] text-[#444444] font-medium">
            {expenses.length} expenses • Total ₹{totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
          </div>
          <Link href={`/groups/${id}/add-expense`} className="bg-positivus-green text-positivus-black border-2 border-positivus-black rounded-xl px-6 py-2.5 font-bold hover:bg-positivus-black hover:text-positivus-white transition-colors text-[15px]">
            + Add Expense
          </Link>
        </div>

        {/* Expense List */}
        <div className="py-10 space-y-4">
          {expenses.length === 0 ? (
            <div className="text-center py-20 border-2 border-positivus-black border-dashed rounded-[24px]">
              <h2 className="text-xl font-bold text-positivus-black mb-2">No expenses yet</h2>
              <p className="text-[#444444] font-medium">Click the Add Expense button to get started.</p>
            </div>
          ) : (
            expenses.map((expense) => {
              return (
                <div key={expense.id} className={`bg-positivus-white border-2 border-positivus-black rounded-[24px] px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors`}>
                  <div>
                    <h3 className="text-[20px] font-extrabold text-positivus-black mb-2">{expense.title}</h3>
                    <p className="text-[#777777] text-[15px] font-medium">
                      Paid by {expense.paid_by_name} • {expense.category} • {new Date(expense.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-right">
                    <span className="text-[24px] font-extrabold text-positivus-black">
                      ₹{parseFloat(expense.amount).toLocaleString('en-IN', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                    </span>
                    <span className={`px-[16px] py-[4px] rounded-full border-2 border-positivus-black text-[13px] font-bold ${expense.split_type === 'equal' ? 'bg-positivus-green text-positivus-black' : 'bg-positivus-black text-positivus-white'}`}>
                      {expense.split_type === 'equal' ? 'Equal' : 'Custom'}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-positivus-white border-t-2 border-positivus-black py-5 z-50">
          <div className="max-w-[1100px] mx-auto px-[60px] w-full flex items-center justify-between">
            <div className="font-medium text-[#444444] text-[17px] hidden sm:block">
              {expenses.length} expenses • ₹{totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 0, maximumFractionDigits: 0})} total
            </div>
            <Link href={`/groups/${id}/settle`} className="w-full sm:w-auto bg-positivus-black text-positivus-white border-2 border-positivus-black rounded-[14px] px-[24px] py-[12px] font-bold text-center hover:opacity-80 transition-opacity text-[15px]">
              View Settlement Plan →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
