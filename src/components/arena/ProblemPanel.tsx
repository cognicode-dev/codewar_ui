import { cn } from '@/utils'
import { ProblemHeader } from './ProblemHeader'
import { ConstraintsCard } from './ConstraintsCard'
import { ExampleCard } from './ExampleCard'
import { TagList } from './TagList'
import { BookOpen, HelpCircle, MessagesSquare } from 'lucide-react'

interface Example {
  id: number
  input: string
  output: string
  explanation?: string
}

interface ProblemPanelProps {
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  points: number
  acceptance: string
  estTime: string
  memory: string
  timeLimit: string
  statementHtml: string[]
  constraints: string[]
  examples: Example[]
  tags: string[]
  isBright?: boolean
  onShowHint?: () => void
  onShowEditorial?: () => void
  onShowDiscussion?: () => void
}

export function ProblemPanel({
  title,
  difficulty,
  points,
  acceptance,
  estTime,
  memory,
  timeLimit,
  statementHtml,
  constraints,
  examples,
  tags,
  isBright = false,
  onShowHint,
  onShowEditorial,
  onShowDiscussion,
}: ProblemPanelProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden select-none bg-transparent">
      {/* Scrollable Content Region */}
      <div className={cn(
        "flex-1 p-6 overflow-y-auto no-scrollbar space-y-6 min-h-0",
        isBright ? "text-slate-700" : "text-slate-300"
      )}>
        {/* Title and Badges */}
        <ProblemHeader 
          title={title}
          difficulty={difficulty}
          points={points}
          acceptance={acceptance}
          isBright={isBright}
        />

        {/* Technical Metadata Row */}
        <div className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs border-b pb-4",
          isBright ? "text-slate-500 border-slate-200/80" : "text-slate-400/90 border-slate-900/60"
        )}>
          <div>Est. Time: <span className="text-purple-600 font-semibold">{estTime}</span></div>
          <div className={isBright ? "text-slate-300" : "text-slate-700"}>•</div>
          <div>Memory Limit: <span className={cn("font-medium", isBright ? "text-slate-700" : "text-slate-355")}>{memory}</span></div>
          <div className={isBright ? "text-slate-300" : "text-slate-700"}>•</div>
          <div>Time Limit: <span className={cn("font-medium", isBright ? "text-slate-700" : "text-slate-355")}>{timeLimit}</span></div>
        </div>

        {/* Statement paragraphs */}
        <div className="space-y-4 text-sm leading-relaxed pr-1">
          {statementHtml.map((para, i) => (
            <p 
              key={i} 
              className={isBright ? "text-slate-600" : "text-slate-300"}
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}
        </div>

        {/* Constraints */}
        <ConstraintsCard 
          constraints={constraints} 
          isBright={isBright} 
        />

        {/* Examples */}
        <div className="space-y-5">
          {examples.map((example) => (
            <ExampleCard 
              key={example.id}
              id={example.id}
              input={example.input}
              output={example.output}
              explanation={example.explanation}
              isBright={isBright}
            />
          ))}
        </div>

        {/* Tags */}
        <TagList 
          tags={tags} 
          isBright={isBright} 
        />
      </div>

      {/* Pinned Action Buttons Footer */}
      <div className={cn(
        "p-4 border-t flex-shrink-0 flex items-center justify-between gap-3 bg-transparent",
        isBright ? "border-slate-200" : "border-slate-900"
      )}>
        <button 
          onClick={onShowHint}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold select-none cursor-pointer transition-all duration-200",
            isBright 
              ? "bg-[#FFFDF2] text-amber-700 border-amber-500/25 hover:bg-[#FFFDF2]/90 hover:border-amber-500/40" 
              : "bg-[#1c1c0e] text-yellow-500 border-yellow-500/20 hover:bg-[#252514]"
          )}
        >
          <HelpCircle size={14} />
          Hints
        </button>
        <button 
          onClick={onShowEditorial}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold select-none cursor-pointer transition-all duration-200",
            isBright 
              ? "bg-[#F2FCF7] text-emerald-700 border-emerald-500/25 hover:bg-[#F2FCF7]/90 hover:border-emerald-500/40" 
              : "bg-[#0e1c14] text-emerald-400 border-emerald-500/20 hover:bg-[#14261b]"
          )}
        >
          <BookOpen size={14} />
          Editorial
        </button>
        <button 
          onClick={onShowDiscussion}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold select-none cursor-pointer transition-all duration-200",
            isBright 
              ? "bg-[#F2F4FA] text-slate-700 border-slate-200 hover:bg-[#F2F4FA]/90 hover:border-slate-350" 
              : "bg-slate-900 text-slate-300 border-slate-800/60 hover:bg-slate-800/70"
          )}
        >
          <MessagesSquare size={14} />
          Discussion
        </button>
      </div>
    </div>
  )
}
