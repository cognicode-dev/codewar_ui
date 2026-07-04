import { useState, useRef, useEffect } from 'react'
import { BottomTabs } from './BottomTabs'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/utils'

interface ConsolePanelProps {
  isBright?: boolean
  initialCollapsed?: boolean
}

export function ConsolePanel({
  isBright = false,
  initialCollapsed = true,
}: ConsolePanelProps) {
  const [collapsed, setCollapsed] = useState(initialCollapsed)
  const [height, setHeight] = useState(200)
  const [activeTab, setActiveTab] = useState('Test Cases')
  const isDragging = useRef(false)

  // Dragging logic to resize console height
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return
    const newHeight = window.innerHeight - e.clientY
    if (newHeight >= 120 && newHeight <= 450) {
      setHeight(newHeight)
    }
  }

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }
  }

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const tabs = ['Test Cases', 'Output', 'Console', 'Submissions']

  return (
    <div 
      className={cn(
        "flex flex-col border-t select-none transition-colors duration-300 w-full relative z-25",
        isBright 
          ? "border-slate-200/80 bg-[#ffffff]/70 backdrop-blur-md" 
          : "border-slate-900 bg-[#05070c]/90 backdrop-blur-md"
      )}
      style={{
        height: collapsed ? '36px' : `${height}px`,
        transition: isDragging.current ? 'none' : 'height 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
      }}
    >
      {/* Resizer handle bar - visible only when expanded */}
      {!collapsed && (
        <div 
          onMouseDown={handleMouseDown}
          className="absolute -top-[3px] left-0 right-0 h-[6px] cursor-row-resize z-30 bg-transparent hover:bg-violet-500/20 active:bg-violet-500/40 transition-colors"
        />
      )}

      {/* Header Tab Bar Area */}
      <div className="flex items-center justify-between min-h-[36px] h-9">
        <div className="flex-1 h-full">
          <BottomTabs 
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab)
              setCollapsed(false) // auto expand on tab click
            }}
            tabs={tabs}
            isBright={isBright}
          />
        </div>

        {/* Collapse Toggle Trigger */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "px-4 h-full flex items-center justify-center border-l transition-colors cursor-pointer select-none border-b",
            isBright 
              ? "border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800" 
              : "border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          )}
        >
          {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Console Tab Content Area - hidden when collapsed */}
      {!collapsed && (
        <div className={cn(
          "flex-1 p-5 overflow-y-auto no-scrollbar font-mono text-[12px] leading-relaxed",
          isBright ? "text-slate-700 bg-white/20" : "text-slate-400 bg-slate-950/20"
        )}>
          {activeTab === 'Test Cases' && (
            <div className="space-y-4">
              <div>
                <span className="text-slate-500 font-semibold block mb-1">nums =</span>
                <div className={cn("p-2.5 rounded-xl border max-w-sm", isBright ? "bg-white/80 border-slate-200 text-slate-700" : "bg-[#030407] border-slate-900 text-slate-300")}>
                  [1, 3, 4, 2, 2]
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block mb-1">Expected Output =</span>
                <div className={cn("p-2.5 rounded-xl border max-w-sm", isBright ? "bg-white/80 border-slate-200 text-slate-700" : "bg-[#030407] border-slate-900 text-slate-300")}>
                  2
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Output' && (
            <div className="space-y-2">
              <div className="text-emerald-500 font-bold flex items-center gap-1.5 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Code ran successfully.
              </div>
              <div className={cn("p-4 rounded-xl border max-w-lg leading-relaxed", isBright ? "bg-white/80 border-slate-200 text-slate-700" : "bg-[#030407] border-slate-900 text-slate-300")}>
                <div><span className="text-slate-500 font-semibold">Status:</span> Accepted</div>
                <div><span className="text-slate-500 font-semibold">Your Output:</span> 2</div>
                <div><span className="text-slate-500 font-semibold">Execution Time:</span> 12ms</div>
              </div>
            </div>
          )}

          {activeTab === 'Console' && (
            <div className="text-slate-500">
              &gt; npm install -g typescript<br />
              &gt; tsc --version<br />
              Version 5.2.2<br />
              &gt; ready for live evaluation compilation...
            </div>
          )}

          {activeTab === 'Submissions' && (
            <div className="space-y-3">
              {[
                { time: '2m ago', status: 'Accepted', runtime: '12ms', memory: '41.2 MB', color: 'text-emerald-500' },
                { time: '1h ago', status: 'Time Limit Exceeded', runtime: 'N/A', memory: '64.5 MB', color: 'text-rose-500' },
              ].map((sub, i) => (
                <div key={i} className={cn("flex items-center justify-between p-3 rounded-xl border", isBright ? "bg-white/85 border-slate-200" : "bg-[#030407] border-slate-900")}>
                  <div className="flex items-center gap-3">
                    <span className={cn("font-bold text-[11px]", sub.color)}>{sub.status}</span>
                    <span className="text-[10px] text-slate-500">{sub.time}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 font-semibold">
                    <span>Runtime: {sub.runtime}</span>
                    <span>Memory: {sub.memory}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
