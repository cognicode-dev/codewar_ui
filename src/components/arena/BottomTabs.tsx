import { cn } from '@/utils'

interface BottomTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: string[]
  isBright?: boolean
}

export function BottomTabs({
  activeTab,
  onTabChange,
  tabs,
  isBright = false,
}: BottomTabsProps) {
  return (
    <div className={cn(
      "flex h-9 items-center justify-between border-b px-4 text-[11px] font-sans select-none shrink-0 transition-colors duration-300",
      isBright 
        ? "border-slate-200/80 bg-[#ffffff]/60 text-slate-500" 
        : "border-slate-900 bg-[#06080d]/80 text-slate-550"
    )}>
      {/* Left side tabs */}
      <div className="flex items-center gap-2 h-full">
        {tabs.map((tab) => {
          const isActive = tab === activeTab
          
          // Prepend visual icons/emojis to Console Tabs
          let tabLabel = tab
          if (tab === 'Test Cases') tabLabel = '🧪 Test Cases'
          else if (tab === 'Output') tabLabel = '📤 Output'
          else if (tab === 'Console') tabLabel = '>_ Console'
          else if (tab === 'Submissions') tabLabel = '📜 Submissions'

          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "h-full px-3 font-semibold relative transition-all duration-200 cursor-pointer border-b-2 flex items-center justify-center gap-1.5",
                isActive 
                  ? (isBright ? "text-[#1E1B4B] border-[#7C3AED]" : "text-white border-[#7C3AED]")
                  : (isBright ? "text-slate-500 border-transparent hover:text-slate-700" : "text-slate-500 border-transparent hover:text-slate-300")
              )}
            >
              {tabLabel}
            </button>
          )
        })}
      </div>

      {/* Right side status badge with pulsing neon status dot */}
      <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-550 select-none">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse" />
        <span>Console Online</span>
      </div>
    </div>
  )
}
