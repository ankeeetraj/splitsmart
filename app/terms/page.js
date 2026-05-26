import Navbar from '@/components/Navbar'

export default function TermsPage() {
  return (
    <div className="bg-positivus-white min-h-screen font-sans flex flex-col">
      <Navbar />

      <main className="max-w-[1100px] mx-auto w-full flex-1 px-[60px] pb-20">
        
        {/* Header Section */}
        <div className="py-[48px] border-b-2 border-positivus-black">
          <h1 className="text-[48px] font-extrabold text-positivus-black leading-tight">Terms of Service</h1>
          <p className="text-[#444444] text-[17px] font-medium mt-2">Last updated: May 2025</p>
        </div>

        {/* Content Card */}
        <div className="my-[40px] border-2 border-positivus-black rounded-[14px] p-[40px] bg-positivus-white">
          
          <div className="space-y-6">
            <section className="border-l-[4px] border-positivus-green bg-gray-50/50 p-6 rounded-r-[10px]">
              <h2 className="text-[24px] font-extrabold text-positivus-black mb-3">Use Responsibly</h2>
              <p className="text-[#444444] text-[17px] font-medium leading-relaxed">
                SplitSmart is a tool to help groups split expenses fairly. We are not responsible for disputes between users over payments or amounts owed.
              </p>
            </section>

            <section className="border-l-[4px] border-positivus-green bg-gray-50/50 p-6 rounded-r-[10px]">
              <h2 className="text-[24px] font-extrabold text-positivus-black mb-3">No Financial Liability</h2>
              <p className="text-[#444444] text-[17px] font-medium leading-relaxed">
                SplitSmart does not process payments directly. UPI transactions happen between users through their own payment apps. We are not liable for failed, incorrect, or disputed payments.
              </p>
            </section>

            <section className="border-l-[4px] border-positivus-green bg-gray-50/50 p-6 rounded-r-[10px]">
              <h2 className="text-[24px] font-extrabold text-positivus-black mb-3">Your Account</h2>
              <p className="text-[#444444] text-[17px] font-medium leading-relaxed">
                You are responsible for keeping your login credentials secure. We reserve the right to suspend accounts that misuse the platform or violate these terms.
              </p>
            </section>
          </div>

        </div>
      </main>
    </div>
  )
}
