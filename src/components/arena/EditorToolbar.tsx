import { Cpu, RotateCcw, Play, CheckSquare, Palette } from 'lucide-react'
import { cn } from '@/utils'

interface EditorToolbarProps {
  filename: string
  activeLanguage: string
  onLanguageChange: (lang: string) => void
  activeTheme: string
  onThemeChange: (theme: string) => void
  onReset?: () => void
  onRun?: () => void
  onSubmit?: () => void
  isBright?: boolean
}

export function EditorToolbar({
  filename,
  activeLanguage,
  onLanguageChange,
  activeTheme,
  onThemeChange,
  onReset,
  onRun,
  onSubmit,
  isBright = false,
}: EditorToolbarProps) {
  const languages = ['TypeScript', 'JavaScript', 'Python', 'C++', 'Java']
  const themes = ['Glass Dark', 'Glass Light', 'Cyberpunk', 'Monokai']

  return (
    <div className={cn(
      "flex h-11 items-center justify-between border-b px-4 text-xs font-sans select-none shrink-0 transition-colors duration-300",
      isBright 
        ? "border-slate-200/80 bg-white/94 text-slate-700" 
        : "border-slate-900 bg-[#06080d]/80 text-slate-350"
    )}>
      {/* Left side: Filename indicator */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <span className={cn("font-mono font-semibold", isBright ? "text-slate-800" : "text-slate-200")}>
          {filename}
        </span>
      </div>

      {/* Middle side: Segmented Configuration Control (Language | Theme) */}
      <div className={cn(
        "flex items-center gap-2 p-0.5 rounded-xl border select-none",
        isBright ? "bg-slate-50 border-slate-205" : "bg-[#0c0d12]/75 border-slate-900"
      )}>
        {/* Language Select */}
        <div className="relative flex items-center gap-1.5 pl-2.5 pr-1 py-0.5">
          <Cpu size={12} className="text-slate-400" />
          <select
            value={activeLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-transparent text-slate-700 dark:text-slate-300 text-[11px] font-bold cursor-pointer outline-none border-none pr-1"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang} className="bg-white dark:bg-slate-950">{lang}</option>
            ))}
          </select>
        </div>

        {/* Separator line */}
        <div className="w-px h-4 bg-slate-200/80 dark:bg-slate-800" />

        {/* Theme Select */}
        <div className="relative flex items-center gap-1.5 pl-1 pr-2.5 py-0.5">
          <Palette size={12} className="text-slate-400" />
          <select
            value={activeTheme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="bg-transparent text-slate-700 dark:text-slate-300 text-[11px] font-bold cursor-pointer outline-none border-none pr-1"
          >
            {themes.map((t) => (
              <option key={t} value={t} className="bg-white dark:bg-slate-950">{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Right side: Action Control Buttons Group */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onReset}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all duration-200 active:scale-95",
            isBright 
              ? "bg-white text-slate-600 border-slate-205 hover:bg-slate-100 hover:text-slate-800" 
              : "bg-slate-950 text-slate-400 border-slate-900 hover:bg-slate-900 hover:text-slate-200"
          )}
          title="Reset Code"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>

        <button 
          onClick={onRun}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all duration-200 active:scale-95",
            isBright 
              ? "bg-white text-slate-600 border-slate-205 hover:bg-slate-100 hover:text-slate-800" 
              : "bg-slate-950 text-slate-400 border-slate-900 hover:bg-slate-900 hover:text-slate-200"
          )}
          title="Run Code"
        >
          <Play size={11} />
          <span>Run</span>
        </button>

        <button 
          onClick={onSubmit}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-bold text-white cursor-pointer transition-all duration-200 active:scale-95 shadow-[0_0_15px_rgba(124,58,237,0.35)] bg-gradient-to-r from-violet-650 to-indigo-650 hover:from-violet-550 hover:to-indigo-550"
          title="Submit Solution (Ctrl+Enter)"
        >
          <CheckSquare size={11} />
          <span>Submit</span>
          <span className="opacity-60 text-[9px] font-mono font-normal ml-0.5 bg-white/20 px-1 py-0.5 rounded leading-none shrink-0">Ctrl+Enter</span>
        </button>
      </div>
    </div>
  )
}
