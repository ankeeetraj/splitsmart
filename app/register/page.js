import Navbar from '@/components/Navbar'
import Link from 'next/link'
import AuthForm from '@/components/AuthForm'

export default function RegisterPage() {
  return (
    <div className="bg-positivus-white min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-[1100px] mx-auto w-full flex-1 flex flex-col items-center justify-center px-[60px] py-12">
        <div className="w-full max-w-md border-2 border-positivus-black rounded-[14px] p-10 bg-positivus-white">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-positivus-black">SplitSmart</h1>
            <p className="text-positivus-black mt-2 font-medium">Create your account</p>
          </div>
          
          <AuthForm isLogin={false} />
          
          <div className="mt-8 text-center">
            <p className="text-positivus-black font-medium">
              Already have an account?{' '}
              <Link href="/login" className="font-bold underline hover:text-positivus-green transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
