import { NavLink } from 'react-router-dom'
import {
  IconHome,
  IconHomeFilled,
  IconReportAnalytics,
  IconReportAnalyticsFilled,
} from '@tabler/icons-react'

export default function BottomNav() {
  return (
    <nav className="flex h-[70px] w-full bg-white border-t border-t-[rgba(34,34,34,0.07)]">
      <NavLink to="/main" end className="flex flex-1 flex-col items-center justify-center gap-[2px]">
        {({ isActive }) => (
          <>
            {isActive ? (
              <IconHomeFilled size={32} className="text-[#1F1F1F]" />
            ) : (
              <IconHome size={32} stroke={1.8} className="text-[#B5B5B5]" />
            )}
            <p className={`text-body-02 leading-[1.5] text-center ${isActive ? 'text-[#1F1F1F]' : 'text-[#B5B5B5]'}`}>
              홈
            </p>
          </>
        )}
      </NavLink>
      <NavLink to="/report" className="flex flex-1 flex-col items-center justify-center gap-[2px]">
        {({ isActive }) => (
          <>
            {isActive ? (
              <IconReportAnalyticsFilled size={32} className="text-[#1F1F1F]" />
            ) : (
              <IconReportAnalytics size={32} stroke={1.8} className="text-[#B5B5B5]" />
            )}
            <p className={`text-body-02 leading-[1.5] text-center ${isActive ? 'text-[#1F1F1F]' : 'text-[#B5B5B5]'}`}>
              리포트
            </p>
          </>
        )}
      </NavLink>
    </nav>
  )
}
