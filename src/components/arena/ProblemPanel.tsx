import { cn } from '@/utils'
import { ProblemHeader } from './ProblemHeader'
import { ConstraintsCard } from './ConstraintsCard'
import { ExampleCard } from './ExampleCard'
import { TagList } from './TagList'
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
}: ProblemPanelProps) {
  return (
    <div className={cn(
      "flex flex-col h-full overflow-hidden select-none transition-colors duration-300",
      isBright 
        ? "bg-white/94 backdrop-blur-md border-r border-slate-200/50" 
        : "bg-[#080c12]/75 backdrop-blur-md border-r border-slate-900/50"
    )}>
      {/* Scrollable Content Region */}
      <div className={cn(
        "flex-1 p-6 overflow-y-auto no-scrollbar space-y-6 min-h-0",
        isBright ? "text-slate-800" : "text-slate-300"
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
          isBright ? "text-slate-600 border-slate-200/80" : "text-slate-400/90 border-slate-900/60"
        )}>
          <div>Est. Time: <span className="text-purple-700 font-semibold">{estTime}</span></div>
          <div className={isBright ? "text-slate-450" : "text-slate-700"}>•</div>
          <div>Memory Limit: <span className={cn("font-semibold", isBright ? "text-slate-900" : "text-slate-200")}>{memory}</span></div>
          <div className={isBright ? "text-slate-450" : "text-slate-700"}>•</div>
          <div>Time Limit: <span className={cn("font-semibold", isBright ? "text-slate-900" : "text-slate-200")}>{timeLimit}</span></div>
        </div>

        {/* Statement paragraphs */}
        <div className="space-y-4 text-sm leading-relaxed pr-1">
          {statementHtml.map((para, i) => (
            <p 
              key={i} 
              className={isBright ? "text-slate-800 font-medium" : "text-slate-300"}
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

        <TagList 
          tags={tags} 
          isBright={isBright} 
        />
      </div>
    </div>
  )
}
