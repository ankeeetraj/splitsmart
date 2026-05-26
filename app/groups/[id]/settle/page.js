export const revalidate = 0

import { getGroupBalances } from '@/lib/balances'
import { simplifyDebts } from '@/lib/settle'
import Navbar from '@/components/Navbar'
import SettlementList from '@/components/SettlementList'
import { GoogleGenerativeAI } from "@google/generative-ai"

export default async function SettlePage({ params }) {
  const { id } = params
  
  const balances = await getGroupBalances(id)
  const transactions = simplifyDebts(balances)
  
  // Dummy group name for navbar - in a real app we'd fetch this properly
  const groupName = "Group"
  
  let summary = "Everyone is completely settled up! No debts remain."
  if (transactions.length > 0) {
    if (!process.env.GEMINI_API_KEY) {
      summary = "AI summary unavailable (missing API key)."
    } else {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
        const plainTransactions = transactions.map(t => ({
          from: t.from.name,
          to: t.to.name,
          amount: t.amount
        }))
        const prompt = `Given these settlements needed: ${JSON.stringify(plainTransactions)}, write a friendly 2-3 sentence plain English summary of who owes whom, using ₹ for currency. Be specific and human.`
        const result = await model.generateContent(prompt)
        summary = result.response.text()
      } catch (error) {
        console.error("Gemini API Error:", error)
        summary = "AI summary is currently unavailable."
      }
    }
  }

  return (
    <div className="bg-positivus-white min-h-screen flex flex-col font-sans">
      <Navbar groupName={groupName} />
      
      <main className="max-w-[1100px] mx-auto w-full flex-1 pb-[100px] flex flex-col px-[60px]">
        <div className="py-[48px] border-b-2 border-positivus-black">
          <h1 className="text-[52px] font-extrabold text-positivus-black leading-[1.1]">Here's how to settle up.</h1>
        </div>

        <div className="pt-[40px] flex flex-col gap-[32px] w-full max-w-[900px] mx-auto">
          {/* AI Summary */}
          <div className="bg-positivus-green border-2 border-positivus-black rounded-[20px] p-[28px] flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-positivus-black text-positivus-white w-[56px] h-[56px] rounded-2xl border-2 border-positivus-black flex items-center justify-center shrink-0">
              <span className="text-2xl">✦</span>
            </div>
            <div>
              <div className="font-extrabold text-[#191A23]/60 mb-2 uppercase text-[12px] tracking-[0.1em]">AI SUMMARY</div>
              <p className="text-[19px] font-bold text-positivus-black leading-relaxed">{summary}</p>
            </div>
          </div>

          <div className="w-full">
            <SettlementList transactions={transactions} groupId={id} />
          </div>
        </div>
      </main>
    </div>
  )
}
