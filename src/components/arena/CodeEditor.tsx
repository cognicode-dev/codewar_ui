import React, { useRef } from 'react'
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  // Split code by newline to render line-by-line syntax coloring & line numbers
  const lines = value.split('\n')

  // Synchronize scrolls between textarea, highlighted text, and line numbers column
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget
    if (highlightRef.current) {
      highlightRef.current.scrollTop = scrollTop
      highlightRef.current.scrollLeft = scrollLeft
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop
    }
  }

  // Handle Tab keypress to insert 2 spaces instead of moving input focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart, selectionEnd } = e.currentTarget
      const newValue = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd)
      onChange?.(newValue)

      // Reposition caret right after insertion
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + 2
        }
      }, 0)
    }
  }

  return (
    <div className={cn(
      "flex-grow flex overflow-hidden relative font-mono text-[13px] leading-[20px] transition-colors duration-300 w-full min-h-0",
      isBright ? "bg-white/94 text-slate-805" : "bg-[#080c12]/90 text-slate-400"
    )}>
      {/* Line Numbers Column */}
      <div 
        ref={lineNumbersRef}
        className={cn(
          "py-6 px-4 text-right select-none flex-shrink-0 border-r border-dashed text-xs overflow-hidden h-full",
          isBright ? "text-slate-400 border-slate-200" : "text-slate-655 border-slate-900"
        )}
        style={{ scrollbarWidth: 'none' }}
      >
        {lines.map((_, i) => (
          <div key={i} className="h-5">{i + 1}</div>
        ))}
      </div>

      {/* Editor Content Area (Stacked Layers) */}
      <div className="flex-grow h-full relative overflow-hidden min-w-0">
        
        {/* Layer 1: Syntax Highlight Display Layer (Clicks pass through) */}
        <div 
          ref={highlightRef}
          className="absolute inset-0 py-6 px-5 font-mono text-[13px] leading-[20px] pointer-events-none overflow-hidden select-none"
        >
          <pre 
            className="m-0 p-0 font-mono text-[13px] leading-[20px]"
            style={{ fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace' }}
          >
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
                  .replace(/\b(\d+)\b/g, '<span class="text-amber-505 font-semibold">$1</span>')
                  .replace(/\b(export|function|let|const|return|do|while|if|for|import|from)\b/g, `<span class="${isBright ? 'text-purple-700 font-semibold' : 'text-purple-400 font-medium'}">$1</span>`)
                  .replace(/\b(nums|tortoise|hare|result|dup|val|array)\b/g, `<span class="${isBright ? 'text-indigo-805 font-medium' : 'text-indigo-300'}">$1</span>`)
                  .replace(/\b(number|string|boolean|void)\b/g, `<span class="${isBright ? 'text-emerald-700 font-semibold' : 'text-emerald-405'}">$1</span>`)

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

        {/* Layer 2: Transparent Textarea Input Layer (Captures caret, scroll, and type actions) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className={cn(
            "absolute inset-0 py-6 px-5 font-mono text-[13px] leading-[20px] bg-transparent border-none outline-none resize-none overflow-auto w-full h-full z-10 selection:bg-purple-500/25",
            isBright ? "text-transparent caret-slate-800" : "text-transparent caret-slate-200"
          )}
          style={{
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            whiteSpace: 'pre',
            wordWrap: 'normal',
          }}
        />

      </div>
    </div>
  )
}
