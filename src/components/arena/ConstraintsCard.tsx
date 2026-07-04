import { cn } from '@/utils'

interface ConstraintsCardProps {
  constraints: string[]
  isBright?: boolean
}

export function ConstraintsCard({ constraints, isBright = false }: ConstraintsCardProps) {
  return (
    <div className={cn(
      "pl-4 py-3 pr-3 rounded-r-lg border-l-2 border-y-transparent border-r-transparent space-y-1.5 text-xs select-none",
      isBright 
        ? "bg-[#F2F4FA]/80 border-l-amber-500/60 text-slate-600" 
        : "bg-[#030407] border-l-amber-500/40 text-slate-400/90"
    )}>
      <div className={cn("font-semibold uppercase tracking-widest text-[9px]", isBright ? "text-slate-500" : "text-slate-400")}>
        Constraints
      </div>
      <ul className="space-y-1 list-disc list-inside">
        {constraints.map((constraint, index) => (
          <li key={index} className="leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: constraint }} />
          </li>
        ))}
      </ul>
    </div>
  )
}
