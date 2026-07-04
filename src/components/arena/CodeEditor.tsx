import { cn } from '@/utils'

interface CodeEditorProps {
  value: string
  language: string
  theme: string
  onChange?: (value: string) => void
  isBright?: boolean
}

export function CodeEditor({
  value,
  language,
  theme,
  onChange,
  isBright = false,
}: CodeEditorProps) {
  // Split the mock code value by newline to render line-by-line syntax styles
  const lines = value.split('\n')

  return (
    <div className={cn(
      "flex-1 flex overflow-hidden relative font-mono text-[13px] leading-relaxed transition-colors duration-300",
      isBright ? "bg-[#ffffff]/35 text-slate-800" : "bg-[#080c12]/90 text-slate-400"
    )}>
      {/* Line Numbers Column */}
      <div className={cn(
        "py-6 px-4 text-right select-none flex-shrink-0 border-r border-dashed text-xs",
        isBright ? "text-slate-400 border-slate-200" : "text-slate-655 border-slate-900"
      )}>
        {lines.map((_, i) => (
          <div key={i} className="h-5">{i + 1}</div>
        ))}
      </div>

      {/* Code Text Column */}
      <div className="flex-1 py-6 px-5 overflow-y-auto no-scrollbar min-w-0">
        <pre className="m-0 p-0 overflow-x-auto no-scrollbar w-full h-full">
          <code>
            {lines.map((line, i) => {
              // Highlight comments entirely if the line starts with double slash
              if (line.trim().startsWith('//')) {
                return (
                  <div 
                    key={i} 
                    className="h-5 whitespace-pre min-w-max text-slate-500 font-normal italic"
                  >
                    {line}
                  </div>
                )
              }

              // Apply word-boundary matches to prevent nested HTML tags replacement bugs
              let formatted = line
                .replace(/\b(\d+)\b/g, '<span class="text-amber-500 font-semibold">$1</span>')
                .replace(/\b(export|function|let|const|return|do|while|if|for|import|from)\b/g, `<span class="${isBright ? 'text-purple-700 font-semibold' : 'text-purple-400 font-medium'}">$1</span>`)
                .replace(/\b(nums|tortoise|hare|result|dup|val|array)\b/g, `<span class="${isBright ? 'text-indigo-800' : 'text-indigo-300'}">$1</span>`)
                .replace(/\b(number|string|boolean|void)\b/g, `<span class="${isBright ? 'text-emerald-700 font-semibold' : 'text-emerald-400'}">$1</span>`)
                .replace(/\b(Math|console)\b/g, '<span class="text-blue-500 font-semibold">$1</span>')

              // Append comments at the end of code line if present
              const commentIdx = formatted.indexOf('//')
              if (commentIdx !== -1) {
                const codePart = formatted.substring(0, commentIdx)
                const commentPart = formatted.substring(commentIdx)
                formatted = `${codePart}<span class="text-slate-500 font-normal italic">${commentPart}</span>`
              }

              return (
                <div 
                  key={i} 
                  className="h-5 whitespace-pre min-w-max"
                  dangerouslySetInnerHTML={{ __html: formatted || '&nbsp;' }}
                />
              )
            })}
          </code>
        </pre>
      </div>
    </div>
  )
}
