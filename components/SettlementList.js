'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { markAsSettled } from '@/app/actions/settle'
import QRCode from 'qrcode'

function UpiQR({ upiId, name, amount }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (canvasRef.current && upiId) {
      const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`
      QRCode.toCanvas(canvasRef.current, upiString, { width: 150 }, (err) => {
        if (err) console.error('QR error:', err)
      })
    }
  }, [upiId, name, amount])
  return <canvas ref={canvasRef} className="rounded-xl border-2 border-positivus-black" />
}

export default function SettlementList({ transactions, groupId }) {
  const router = useRouter()
  const [loadingMap, setLoadingMap] = useState({})
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  async function handleSettle(t, index) {
    setLoadingMap(prev => ({...prev, [index]: true}))
    const res = await markAsSettled(groupId, t.from.id, t.to.id, t.amount)
    if (!res.error) {
      router.refresh()
    } else {
      setLoadingMap(prev => ({...prev, [index]: false}))
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-positivus-black border-dashed rounded-[20px] bg-positivus-white">
        <h2 className="text-2xl font-extrabold text-positivus-black mb-2">All settled up!</h2>
        <p className="text-[#444444] font-medium">There are no pending debts in this group.</p>
      </div>
    )
  }

  return (
    <div className="space-y-[32px]">
      {transactions.map((t, index) => {
        const isSettled = loadingMap[index]
        
        if (isSettled) {
          // Settled State
          return (
            <div key={index} className="border-2 border-[#CCCCCC] rounded-[24px] overflow-hidden opacity-60">
              <div className="p-[36px] flex items-center justify-between gap-6 bg-white">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-[64px] h-[64px] rounded-full border-2 border-[#CCCCCC] bg-white flex items-center justify-center font-bold text-xl uppercase text-[#888888]">
                    {t.from.name.substring(0, 2)}
                  </div>
                  <span className="font-bold text-[#888888]">{t.from.name.split(' ')[0]}</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                  <span className="font-extrabold text-[36px] text-[#888888]">
                    ₹{t.amount.toLocaleString('en-IN', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                  </span>
                  <span className="text-[#888888]">→</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-[64px] h-[64px] rounded-full border-2 border-[#CCCCCC] bg-white flex items-center justify-center font-bold text-xl uppercase text-[#888888]">
                    {t.to.name.substring(0, 2)}
                  </div>
                  <span className="font-bold text-[#888888]">{t.to.name.split(' ')[0]}</span>
                </div>
              </div>

              <div className="bg-white border-t-2 border-[#CCCCCC] p-6">
                <div className="bg-[#95DB4E] text-[#191A23] border-2 border-transparent rounded-full px-[18px] py-[6px] text-sm font-extrabold inline-flex items-center gap-2">
                  ✓ Settled
                </div>
              </div>
            </div>
          )
        }

        // Active State
        return (
          <div key={index} className="border-2 border-positivus-black rounded-[24px] overflow-hidden">
            <div className="p-[36px] flex items-center justify-between gap-6 bg-positivus-black text-positivus-white">
              <div className="flex flex-col items-center gap-3">
                <div className="w-[64px] h-[64px] rounded-full border-2 border-[#555555] bg-transparent flex items-center justify-center font-bold text-xl uppercase">
                  {t.from.name.substring(0, 2)}
                </div>
                <span className="font-bold text-white text-[15px]">{t.from.name.split(' ')[0]}</span>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <span className="font-extrabold text-[42px] leading-none">
                  ₹{t.amount.toLocaleString('en-IN', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                </span>
                <span className="text-[#777777] mt-1">→</span>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-[64px] h-[64px] rounded-full border-2 border-[#555555] bg-transparent flex items-center justify-center font-bold text-xl uppercase">
                  {t.to.name.substring(0, 2)}
                </div>
                <span className="font-bold text-white text-[15px]">{t.to.name.split(' ')[0]}</span>
              </div>
            </div>

            <div className="bg-positivus-white border-t-2 border-positivus-black p-6 flex flex-col md:flex-row items-center gap-6">
              {t.to_upi_id && isMobile && (
                <a 
                  href={`upi://pay?pa=${t.to_upi_id}&pn=${encodeURIComponent(t.to.name)}&am=${t.amount}&cu=INR`}
                  className="flex-1 w-full bg-positivus-green text-positivus-black border-2 border-positivus-black rounded-[14px] py-[16px] font-bold hover:bg-positivus-black hover:text-positivus-green transition-colors text-[17px] text-center"
                >
                  Pay via UPI →
                </a>
              )}
              
              {t.to_upi_id && !isMobile && (
                <div className="flex-1 flex items-center justify-center gap-4 border-2 border-positivus-black rounded-[14px] p-2">
                  <UpiQR upiId={t.to_upi_id} name={t.to.name} amount={t.amount} />
                  <span className="text-[13px] font-bold text-positivus-black uppercase tracking-widest px-2">Scan to Pay</span>
                </div>
              )}

              {!t.to_upi_id && (
                <div className="flex-1 w-full flex items-center justify-center text-[#777777] font-medium text-[15px] py-[16px]">
                  No UPI ID provided
                </div>
              )}
              
              <button
                onClick={() => handleSettle(t, index)}
                className="flex-1 w-full bg-positivus-white text-positivus-black border-2 border-positivus-black rounded-[14px] py-[16px] font-bold hover:bg-gray-50 transition-colors text-[17px] self-stretch"
              >
                Mark as Settled
              </button>
            </div>
            
          </div>
        )
      })}
    </div>
  )
}
