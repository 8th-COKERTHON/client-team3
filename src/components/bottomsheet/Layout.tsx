import type { ReactNode } from 'react'

interface BottomSheetLayoutProps {
  children: ReactNode
}

function BottomHandle() {
  return <div className="w-12 h-1 rounded-full bg-[#616161]" />
}

function BottomIndicator() {
  return <div className="h-[5px] w-[134px] rounded-full bg-black" />
}

export default function Layout({ children }: BottomSheetLayoutProps) {
  return (
    <section className="flex w-full flex-col rounded-t-[32px] bg-white border border-red-500">
      <div className="flex w-full items-center justify-center pt-4 pb-6">
        <BottomHandle />
      </div>

      <div className="w-full p-5">
        {children}
      </div>

      <div className="flex items-center justify-center pt-5 pb-2">
        <BottomIndicator />
      </div>
    </section>
  )
}