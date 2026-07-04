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
            "px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-200 select-none",
            isBright 
              ? "bg-[#7C3AED]/8 text-[#7C3AED] hover:bg-[#7C3AED]/15" 
              : "bg-[#7C3AED]/15 text-purple-300 hover:bg-[#7C3AED]/25"
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
