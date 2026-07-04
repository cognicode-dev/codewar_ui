import { cn } from '@/utils'

interface ExampleCardProps {
  id: number
  input: string
  output: string
  explanation?: string
  isBright?: boolean
}

export function ExampleCard({ id, input, output, explanation, isBright = false }: ExampleCardProps) {
  return (
    <div className="space-y-2">
      <span className={cn(
        "text-xs font-bold uppercase tracking-wider block select-none",
        isBright ? "text-slate-500" : "text-slate-400"
      )}>
        Example {id}
      </span>
      <div className={cn(
        "p-4 rounded-2xl border text-xs font-mono overflow-x-auto leading-relaxed space-y-1.5",
        isBright 
          ? "bg-[#F2F4FA]/80 border-slate-200 text-slate-700" 
          : "bg-[#030407] border-slate-900 text-slate-300"
      )}>
        <div>
          <span className="text-purple-500 font-semibold select-none">Input:</span> {input}
        </div>
        <div>
          <span className="text-purple-500 font-semibold select-none">Output:</span> {output}
        </div>
        {explanation && (
          <div className="pt-1.5 border-t border-dashed border-slate-700/20 select-none">
            <span className="text-slate-500 font-semibold">Explanation:</span> {explanation}
          </div>
        )}
      </div>
    </div>
  )
}
