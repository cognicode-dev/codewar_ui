import { cn } from '@/utils'

interface TagListProps {
  tags: string[]
  isBright?: boolean
}

export function TagList({ tags, isBright = false }: TagListProps) {
  return (
    <div className={cn(
      "border-t pt-5 mt-4 flex flex-wrap gap-1.5 select-none",
      isBright ? "border-slate-200" : "border-slate-900"
    )}>
      {tags.map((tag) => (
        <span 
          key={tag} 
          className={cn(
            "px-2.5 py-1 rounded text-[10px] font-semibold border transition-colors",
            isBright 
              ? "bg-white/70 text-slate-600 border-slate-200 hover:text-slate-800 hover:border-slate-350" 
              : "bg-[#030407] text-slate-500 border-slate-900/60 hover:text-slate-400 hover:border-slate-800"
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
