import { sql } from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { getGroupBalances } from '@/lib/balances'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const groups = await sql`
    SELECT g.id, g.name, g.type, g.created_at
    FROM groups g
    JOIN group_members gm ON g.id = gm.group_id
    WHERE gm.user_id = ${session.user.id}
    ORDER BY g.created_at DESC
  `

  // Calculate balances for each group
  const groupsWithBalances = await Promise.all(groups.map(async (g) => {
    const balances = await getGroupBalances(g.id)
    const myBalance = balances.find(b => b.id === session.user.id)?.balance || 0
    return { ...g, myBalance, members: balances }
  }))

  const backgrounds = [
    { bg: 'bg-positivus-black', text: 'text-positivus-white', pill: 'border-positivus-white' },
    { bg: 'bg-positivus-green', text: 'text-positivus-black', pill: 'border-positivus-black' },
    { bg: 'bg-positivus-white', text: 'text-positivus-black', pill: 'border-positivus-black' }
  ]

  return (
    <div className="bg-positivus-white min-h-screen flex flex-col">
      <Navbar />
      
      <main className="max-w-[1100px] mx-auto w-full flex-1 px-[60px]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-12 border-b-2 border-positivus-black">
          <h1 className="text-[48px] font-extrabold text-positivus-black">Your Groups</h1>
          <Link href="/groups/new" className="bg-positivus-green text-positivus-black border-2 border-positivus-black rounded-[14px] px-[24px] py-[12px] font-bold hover:opacity-80 transition-opacity whitespace-nowrap text-[17px]">
            + New Group
          </Link>
        </div>

        {groupsWithBalances.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
            <h2 className="text-2xl font-bold text-positivus-black mb-4">No groups yet</h2>
            <Link href="/groups/new" className="bg-positivus-green text-positivus-black border-2 border-positivus-black rounded-xl px-6 py-3 font-bold hover:opacity-80 transition-opacity">
              Create New Group
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {groupsWithBalances.map((group, index) => {
              const theme = backgrounds[index % 3]
              return (
                <Link key={group.id} href={`/groups/${group.id}`} className="block border-2 border-positivus-black rounded-[24px] overflow-hidden hover:-translate-y-1 transition-transform group">
                  <div className={`p-6 flex flex-col justify-start items-start gap-4 border-b-2 border-positivus-black ${theme.bg} ${theme.text}`}>
                    <h3 className="text-[26px] font-extrabold tracking-tight">{group.name}</h3>
                    <span className={`text-[13px] font-medium px-4 py-1.5 rounded-full border border-current capitalize`}>
                      {group.type}
                    </span>
                  </div>
                  
                  <div className="p-6 bg-positivus-white flex flex-col gap-6">
                    <div className="flex flex-wrap">
                      {group.members.slice(0, 4).map((m, i) => {
                        const isYou = m.id === session.user.id
                        const bgCol = isYou ? 'bg-positivus-white' : (i % 2 === 0 ? 'bg-positivus-green' : 'bg-positivus-black')
                        const txtCol = isYou ? 'text-positivus-black' : (i % 2 === 0 ? 'text-positivus-black' : 'text-positivus-white')
                        
                        return (
                          <div key={i} className={`w-[36px] h-[36px] rounded-full border-2 border-positivus-black ${bgCol} flex items-center justify-center text-[12px] font-bold ${txtCol} uppercase -ml-2 first:ml-0 relative z-[${10-i}]`}>
                            {m.name.substring(0, 2)}
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        {group.myBalance > 0.01 && (
                          <p className={`text-[19px] font-medium text-[#228833]`}>
                            You're owed ₹{Math.abs(group.myBalance).toFixed(0)}
                          </p>
                        )}
                        {group.myBalance < -0.01 && (
                          <p className={`text-[19px] font-medium text-[#cc3333]`}>
                            You owe ₹{Math.abs(group.myBalance).toFixed(0)}
                          </p>
                        )}
                        {Math.abs(group.myBalance) <= 0.01 && (
                          <p className={`text-[19px] font-medium text-[#888888]`}>
                            All settled ✓
                          </p>
                        )}
                      </div>
                      
                      <div className="w-[36px] h-[36px] bg-positivus-black rounded-full flex items-center justify-center text-positivus-white group-hover:bg-positivus-green group-hover:text-positivus-black group-hover:border-2 group-hover:border-positivus-black transition-colors shrink-0">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
