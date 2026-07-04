import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { Play, RotateCcw, FoldVertical, PanelRightClose, PanelRight, ChevronDown } from 'lucide-react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { Button, Tooltip, Separator } from '@/components/ui'
import { cn } from '@/utils'
import { useTheme } from '@/app/providers'
import type { EditorSettings } from '@/types'

interface EditorPanelProps {
  starterCode: string
  settings: EditorSettings
  onCodeChange?: (code: string) => void
}

type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'rust' | 'go'

const languages: { value: Language; label: string }[] = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
]

export function EditorPanel({ starterCode, settings, onCodeChange }: EditorPanelProps) {
  const { theme } = useTheme()
  const [code, setCode] = useState(starterCode)
  const [language, setLanguage] = useState<Language>('typescript')
  const [showMinimap, setShowMinimap] = useState(settings.minimap)
  const [showLangPicker, setShowLangPicker] = useState(false)

  const handleMount: OnMount = useCallback((editor) => {
    editor.focus()
  }, [])

  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
      onCodeChange?.(value)
    }
  }

  const currentLang = languages.find((l) => l.value === language)

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-bg-alt px-3 py-1.5">
        <div className="flex items-center gap-1">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLangPicker(!showLangPicker)}
              className="gap-1 text-xs"
            >
              {currentLang?.label}
              <ChevronDown size={12} />
            </Button>
            {showLangPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowLangPicker(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 top-full z-20 mt-1 w-32 rounded-lg border border-border bg-bg-elevated py-1 shadow-floating"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => { setLanguage(lang.value); setShowLangPicker(false) }}
                      className={cn(
                        'w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-bg-hover',
                        lang.value === language ? 'text-accent' : 'text-fg-muted',
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>
          <Separator orientation="vertical" className="mx-1 h-4" />
          <span className="text-[10px] text-fg-subtle">solution.ts</span>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip content="Reset code">
            <Button variant="ghost" size="icon" onClick={() => setCode(starterCode)}>
              <RotateCcw size={14} />
            </Button>
          </Tooltip>
          <Tooltip content="Toggle minimap">
            <Button variant="ghost" size="icon" onClick={() => setShowMinimap(!showMinimap)}>
              {showMinimap ? <PanelRightClose size={14} /> : <PanelRight size={14} />}
            </Button>
          </Tooltip>
          <Tooltip content="Format code">
            <Button variant="ghost" size="icon">
              <FoldVertical size={14} />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="ambient-editor-surface flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleChange}
          onMount={handleMount}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            fontSize: settings.fontSize,
            tabSize: settings.tabSize,
            minimap: { enabled: showMinimap },
            wordWrap: settings.wordWrap ? 'on' : 'off',
            lineNumbers: settings.lineNumbers ? 'on' : 'off',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
          }}
        />
      </div>

      <div className="flex items-center justify-between border-t border-border bg-bg-alt px-3 py-1.5">
        <div className="flex items-center gap-2 text-[10px] text-fg-subtle">
          <span>Ln 1, Col 1</span>
          <span>Spaces: {settings.tabSize}</span>
          <span>UTF-8</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <RotateCcw size={12} />
            Run
          </Button>
          <Button variant="primary" size="sm" className="gap-1.5 text-xs">
            <Play size={12} />
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
