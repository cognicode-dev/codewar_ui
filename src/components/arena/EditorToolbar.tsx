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
        ? "border-slate-200/80 bg-[#ffffff]/60 text-slate-700" 
        : "border-slate-900 bg-[#06080d]/80 text-slate-350"
    )}>
      {/* Left side: Filename indicator */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <span className={cn("font-mono font-semibold", isBright ? "text-slate-800" : "text-slate-200")}>
          {filename}
        </span>
      </div>

      {/* Middle side: Selectors */}
      <div className="flex items-center gap-3">
        {/* Language Select */}
        <div className="relative flex items-center gap-1.5">
          <Cpu size={12} className="text-slate-400" />
          <select
            value={activeLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className={cn(
              "px-2 py-0.5 rounded border text-[11px] font-semibold cursor-pointer outline-none transition-colors",
              isBright 
                ? "bg-white text-slate-700 border-slate-200 hover:bg-slate-50" 
                : "bg-slate-950 text-slate-300 border-slate-900/60 hover:bg-slate-900"
            )}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Theme Select */}
        <div className="relative flex items-center gap-1.5">
          <Palette size={12} className="text-slate-400" />
          <select
            value={activeTheme}
            onChange={(e) => onThemeChange(e.target.value)}
            className={cn(
              "px-2 py-0.5 rounded border text-[11px] font-semibold cursor-pointer outline-none transition-colors",
              isBright 
                ? "bg-white text-slate-700 border-slate-200 hover:bg-slate-50" 
                : "bg-slate-950 text-slate-300 border-slate-900/60 hover:bg-slate-900"
            )}
          >
            {themes.map((theme) => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Right side: Control buttons */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onReset}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-semibold cursor-pointer transition-all duration-200 active:scale-95",
            isBright 
              ? "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800" 
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
            "flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-semibold cursor-pointer transition-all duration-200 active:scale-95",
            isBright 
              ? "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800" 
              : "bg-slate-950 text-slate-400 border-slate-900 hover:bg-slate-900 hover:text-slate-200"
          )}
          title="Run Code"
        >
          <Play size={11} />
          <span>Run</span>
        </button>

        <button 
          onClick={onSubmit}
          className="flex items-center gap-1 px-3.5 py-1 rounded-xl text-[11px] font-bold text-white cursor-pointer transition-all duration-200 active:scale-95 shadow-[0_4px_12px_rgba(124,58,237,0.22)] bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
          title="Submit Solution"
        >
          <CheckSquare size={11} />
          <span>Submit</span>
        </button>
      </div>
    </div>
  )
}
