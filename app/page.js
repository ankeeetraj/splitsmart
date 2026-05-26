import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function LandingPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="bg-positivus-white min-h-screen font-sans flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b-2 border-positivus-black">
        <div className="max-w-[1100px] mx-auto w-full px-[60px] py-[72px] grid md:grid-cols-[1fr_1fr] gap-[60px] items-center">
          <div className="flex flex-col gap-8 pr-10">
            <h1 className="text-[68px] leading-[1.0] font-extrabold text-positivus-black tracking-tight">
              Split<br/>Smart.<br/>Settle<br/>Faster.
            </h1>
            <p className="text-[#444444] text-[19px] leading-relaxed max-w-[420px] font-medium">
              Add expenses, let AI figure out who pays whom — in the fewest transactions possible. No confusion, no awkward reminders.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href={session ? "/dashboard" : "/register"} className="bg-positivus-black text-positivus-white border-2 border-positivus-black rounded-[14px] px-[32px] py-[16px] font-bold hover:opacity-80 transition-opacity">
                Create a Group →
              </Link>
              <a href="#how-it-works" className="bg-positivus-white text-positivus-black border-2 border-positivus-black rounded-[14px] px-[32px] py-[16px] font-bold hover:bg-gray-50 transition-colors">
                How it Works
              </a>
            </div>
          </div>
          
          <div className="bg-positivus-green border-2 border-positivus-black rounded-[40px] aspect-square relative overflow-hidden flex items-center justify-center p-0">
            <img 
              src="/illustration.png" 
              alt="SplitSmart Illustration" 
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "38px" }}
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="w-full">
        <div className="max-w-[1100px] mx-auto w-full px-[60px] py-[72px]">
          <div className="flex flex-col items-start mb-[32px]">
            <span className="bg-positivus-green text-positivus-black border-2 border-positivus-black rounded-full px-[20px] py-[8px] text-[18px] font-bold mb-6">
              How it Works
            </span>
            <h2 className="text-[38px] font-extrabold text-positivus-black">How it Works</h2>
          </div>

          <div className="border-2 border-positivus-black rounded-[32px] overflow-hidden flex flex-col md:flex-row">
            {/* Card 1 */}
            <div className="flex-1 bg-positivus-white px-[32px] py-[36px] min-h-[220px] md:border-r-2 border-b-2 md:border-b-0 border-positivus-black relative">
              <div className="text-[64px] font-extrabold text-[#E5E5E5] leading-none mb-4">01</div>
              <h3 className="text-[26px] leading-[1.2] font-extrabold text-positivus-black mb-4">Create a<br/>Group</h3>
              <p className="text-[#444444] text-[17px] font-medium leading-relaxed">Name your group, add members with their UPI IDs, and you're ready to go.</p>
            </div>
            {/* Card 2 */}
            <div className="flex-1 bg-positivus-black px-[32px] py-[36px] min-h-[220px] md:border-r-2 border-b-2 md:border-b-0 border-positivus-black relative">
              <div className="text-[64px] font-extrabold text-[#333333] leading-none mb-4">02</div>
              <h3 className="text-[26px] leading-[1.2] font-extrabold text-positivus-white mb-4">Add Expenses</h3>
              <p className="text-[#cccccc] text-[17px] font-medium leading-relaxed">Log who paid, how much, and split equally or with custom amounts.</p>
            </div>
            {/* Card 3 */}
            <div className="flex-1 bg-positivus-green px-[32px] py-[36px] min-h-[220px] relative">
              <div className="text-[64px] font-extrabold text-[#95DB4E] leading-none mb-4">03</div>
              <h3 className="text-[26px] leading-[1.2] font-extrabold text-positivus-black mb-4">AI Settles</h3>
              <p className="text-[#444444] text-[17px] font-medium leading-relaxed">AI finds minimum transactions. Pay via UPI in one tap or scan a QR.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full">
        <div className="max-w-[1100px] mx-auto w-full px-[60px] py-[72px]">
          <div className="flex flex-col items-start mb-[32px]">
            <span className="bg-positivus-green text-positivus-black border-2 border-positivus-black rounded-full px-[20px] py-[8px] text-[18px] font-bold mb-6">
              Features
            </span>
            <h2 className="text-[38px] font-extrabold text-positivus-black">Everything you need to split fairly</h2>
          </div>

          <div className="border-2 border-positivus-black rounded-[32px] overflow-hidden grid md:grid-cols-2">
            {/* Cell 1 */}
            <div className="bg-positivus-white px-[32px] py-[36px] min-h-[200px] border-b-2 md:border-r-2 border-positivus-black">
              <div className="w-12 h-12 border-2 border-positivus-black rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">+</span>
              </div>
              <h3 className="text-[26px] font-extrabold text-positivus-black mb-4">Minimum Transactions</h3>
              <p className="text-[#444444] text-[17px] font-medium">AI simplifies all debts so your group settles in as few payments as possible.</p>
            </div>
            {/* Cell 2 */}
            <div className="bg-positivus-black px-[32px] py-[36px] min-h-[200px] border-b-2 border-positivus-black">
              <div className="w-12 h-12 border-2 border-positivus-white rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl text-white">=</span>
              </div>
              <h3 className="text-[26px] font-extrabold text-positivus-white mb-4">Plain English Summary</h3>
              <p className="text-[#cccccc] text-[17px] font-medium">"Ankit owes Rohit ₹650 for dinner." No confusing debt tables.</p>
            </div>
            {/* Cell 3 */}
            <div className="bg-positivus-green px-[32px] py-[36px] min-h-[200px] md:border-r-2 border-positivus-black">
              <div className="w-12 h-12 border-2 border-positivus-black rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">₹</span>
              </div>
              <h3 className="text-[26px] font-extrabold text-positivus-black mb-4">UPI Payment Links</h3>
              <p className="text-[#444444] text-[17px] font-medium">One-tap UPI on mobile. QR code on desktop. Settle instantly.</p>
            </div>
            {/* Cell 4 */}
            <div className="bg-positivus-white px-[32px] py-[36px] min-h-[200px]">
              <div className="w-12 h-12 border-2 border-positivus-black rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-[26px] font-extrabold text-positivus-black mb-4">Group History</h3>
              <p className="text-[#444444] text-[17px] font-medium">Track all expenses across time. See who spent what on every trip.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-positivus-black text-positivus-white mt-auto rounded-t-[32px]">
        <div className="max-w-[1100px] mx-auto w-full px-[60px] py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="text-[26px] font-extrabold tracking-tight">SplitSmart</div>
            <div className="flex gap-8 font-medium">
              <a href="#features" className="hover:text-positivus-green transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-positivus-green transition-colors">How it Works</a>
              <Link href="/privacy" className="hover:text-positivus-green transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-positivus-green transition-colors">Terms</Link>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 flex justify-center">
            
          </div>
        </div>
      </footer>
    </div>
  )
}
