import Navbar from '@/components/Navbar'

export default function PrivacyPage() {
  return (
    <div className="bg-positivus-white min-h-screen font-sans flex flex-col">
      <Navbar />

      <main className="max-w-[1100px] mx-auto w-full flex-1 px-[60px] pb-20">
        
        {/* Header Section */}
        <div className="py-[48px] border-b-2 border-positivus-black">
          <h1 className="text-[48px] font-extrabold text-positivus-black leading-tight">Privacy Policy</h1>
          <p className="text-[#444444] text-[17px] font-medium mt-2">Last updated: May 2025</p>
        </div>

        {/* Content Card */}
        <div className="my-[40px] border-2 border-positivus-black rounded-[14px] p-[40px] bg-positivus-white">
          
          <div className="space-y-10">
            <section>
              <h2 className="text-[24px] font-extrabold text-positivus-black mb-3">What we collect</h2>
              <p className="text-[#444444] text-[17px] font-medium leading-relaxed">
                SplitSmart collects only the information you provide — your name, email, and optional UPI ID — to power the expense splitting features.
              </p>
            </section>

            <section>
              <h2 className="text-[24px] font-extrabold text-positivus-black mb-3">How we use it</h2>
              <p className="text-[#444444] text-[17px] font-medium leading-relaxed">
                Your data is used solely to display your groups, calculate expense splits, and generate UPI payment links. We do not sell your data, share it with third parties, or use it for advertising.
              </p>
            </section>

            <section>
              <h2 className="text-[24px] font-extrabold text-positivus-black mb-3">Data security</h2>
              <p className="text-[#444444] text-[17px] font-medium leading-relaxed">
                Your data is stored securely on our servers. Passwords are hashed and never stored in plain text.
              </p>
            </section>

            <section>
              <h2 className="text-[24px] font-extrabold text-positivus-black mb-3">Your rights</h2>
              <p className="text-[#444444] text-[17px] font-medium leading-relaxed">
                You can delete your account at any time by contacting us. All your data will be permanently removed.
              </p>
            </section>
          </div>

        </div>
      </main>
    </div>
  )
}
