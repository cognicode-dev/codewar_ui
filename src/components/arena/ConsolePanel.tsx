import { useState, useRef, useEffect } from 'react'
import { BottomTabs } from './BottomTabs'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/utils'

interface ConsolePanelProps {
  isBright?: boolean
  initialCollapsed?: boolean
  examples?: { id?: number; input: string; output: string }[]
  activeSubmission?: {
    status: string
    verdict?: string | null
    timeMs?: number | null
    memoryMb?: number | null
    error?: string | null
    results?: any[]
  } | null
  submissions?: any[]
}

export function ConsolePanel({
  isBright = false,
  initialCollapsed = true,
  examples = [],
  activeSubmission = null,
  submissions = [],
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

  // Auto expand when there's an active submission running/completing
  useEffect(() => {
    if (activeSubmission) {
      setCollapsed(false)
      setActiveTab('Output')
    }
  }, [activeSubmission])

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
          ? "border-slate-200/80 bg-white/94 backdrop-blur-md" 
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
              {examples && examples.length > 0 ? (
                examples.map((ex, idx) => (
                  <div key={idx} className="space-y-2 border-b border-slate-900/10 pb-4 last:border-b-0">
                    <span className="text-indigo-500 font-bold block mb-1">Case {idx + 1}</span>
                    <div>
                      <span className="text-slate-500 font-semibold block mb-1">Input =</span>
                      <pre className={cn("p-2.5 rounded-xl border max-w-sm whitespace-pre-wrap font-mono", isBright ? "bg-white/80 border-slate-200 text-slate-700" : "bg-[#030407] border-slate-900 text-slate-300")}>
                        {ex.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block mb-1">Expected Output =</span>
                      <pre className={cn("p-2.5 rounded-xl border max-w-sm whitespace-pre-wrap font-mono", isBright ? "bg-white/80 border-slate-200 text-slate-700" : "bg-[#030407] border-slate-900 text-slate-300")}>
                        {ex.output}
                      </pre>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic">No example test cases configured for this problem.</div>
              )}
            </div>
          )}

          {activeTab === 'Output' && (
            <div className="space-y-2">
              {activeSubmission ? (
                <>
                  <div className={cn(
                    "font-bold flex items-center gap-1.5 mb-2",
                    activeSubmission.status === 'COMPLETED' 
                      ? activeSubmission.verdict === 'ACCEPTED' ? 'text-emerald-500' : 'text-rose-500'
                      : activeSubmission.status === 'FAILED' ? 'text-rose-500' : 'text-indigo-500'
                  )}>
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full animate-pulse",
                      activeSubmission.status === 'COMPLETED' 
                        ? activeSubmission.verdict === 'ACCEPTED' ? 'bg-emerald-500' : 'bg-rose-500'
                        : activeSubmission.status === 'FAILED' ? 'bg-rose-500' : 'bg-indigo-500'
                    )} />
                    {activeSubmission.status === 'PENDING' && "Submission in Queue..."}
                    {activeSubmission.status === 'RUNNING' && "Executing Test Cases..."}
                    {activeSubmission.status === 'FAILED' && "Execution Failed"}
                    {activeSubmission.status === 'COMPLETED' && (
                      activeSubmission.verdict === 'ACCEPTED' 
                        ? "Accepted - All test cases passed!"
                        : `Rejected - ${activeSubmission.verdict}`
                    )}
                  </div>
                  <div className={cn("p-4 rounded-xl border max-w-lg leading-relaxed space-y-1.5", isBright ? "bg-white/80 border-slate-200 text-slate-700" : "bg-[#030407] border-slate-900 text-slate-300")}>
                    <div>
                      <span className="text-slate-500 font-semibold">Status:</span> {activeSubmission.status}
                    </div>
                    {activeSubmission.verdict && (
                      <div>
                        <span className="text-slate-500 font-semibold">Verdict:</span> {activeSubmission.verdict}
                      </div>
                    )}
                    {activeSubmission.timeMs !== undefined && activeSubmission.timeMs !== null && (
                      <div>
                        <span className="text-slate-500 font-semibold">Runtime:</span> {activeSubmission.timeMs}ms
                      </div>
                    )}
                    {activeSubmission.memoryMb !== undefined && activeSubmission.memoryMb !== null && (
                      <div>
                        <span className="text-slate-500 font-semibold">Memory:</span> {activeSubmission.memoryMb}MB
                      </div>
                    )}
                    {activeSubmission.error && (
                      <div className="pt-2">
                        <span className="text-rose-500 font-bold block mb-1">Error Logs:</span>
                        <pre className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/10 text-rose-300 text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {activeSubmission.error}
                        </pre>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-slate-500 italic">No output logs. Click "Run" or "Submit" to execute your solution.</div>
              )}
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
              {submissions && submissions.length > 0 ? (
                submissions.map((sub, i) => {
                  const isAccepted = sub.verdict === 'ACCEPTED'
                  const color = isAccepted ? 'text-emerald-500' : 'text-rose-500'
                  return (
                    <div key={i} className={cn("flex items-center justify-between p-3 rounded-xl border", isBright ? "bg-white/85 border-slate-200" : "bg-[#030407] border-slate-900")}>
                      <div className="flex items-center gap-3">
                        <span className={cn("font-bold text-[11px]", color)}>
                          {sub.verdict || sub.status}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(sub.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-slate-500 font-semibold">
                        <span>Runtime: {sub.timeMs !== null ? `${sub.timeMs}ms` : 'N/A'}</span>
                        <span>Memory: {sub.memoryMb !== null ? `${sub.memoryMb}MB` : 'N/A'}</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-slate-500 italic">No submissions recorded yet.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
