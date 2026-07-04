import React, { useState, useEffect } from 'react'
import { Cpu, RotateCcw, Play, CheckSquare, Palette, Loader2, Check, FileCode2 } from 'lucide-react'
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
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success'>('idle')
  const [fileStatus, setFileStatus] = useState<'saved' | 'editing' | 'submitting'>('saved')

  const languages = ['TypeScript', 'JavaScript', 'Python', 'C++', 'Java']
  const themes = ['Glass Dark', 'Glass Light', 'Cyberpunk', 'Monokai']

  // Trigger editing status indicator when changing selectors
  const triggerEditing = () => {
    setFileStatus('editing')
    const timer = setTimeout(() => {
      setFileStatus('saved')
    }, 1800)
    return () => clearTimeout(timer)
  }

  const handleLanguageChange = (lang: string) => {
    onLanguageChange(lang)
    triggerEditing()
  }

  const handleThemeChange = (theme: string) => {
    onThemeChange(theme)
    triggerEditing()
  }

  const handleSubmitClick = () => {
    if (submitState !== 'idle') return
    setSubmitState('loading')
    setFileStatus('submitting')
    
    // Simulate compilation pipeline delay
    setTimeout(() => {
      setSubmitState('success')
      
      setTimeout(() => {
        setSubmitState('idle')
        setFileStatus('saved')
      }, 2000)
    }, 1800)

    if (onSubmit) onSubmit()
  }

  // Visual helper for language abbreviation
  const getLangAbbreviation = (lang: string) => {
    if (lang === 'TypeScript') return 'TS'
    if (lang === 'JavaScript') return 'JS'
    return lang
  }

  // Theme name display optimizer
  const getThemeAbbreviation = (t: string) => {
    if (t === 'Glass Dark') return 'Dark'
    if (t === 'Glass Light') return 'Light'
    return t
  }

  return (
    <div className={cn(
      "flex h-[48px] items-center justify-between border-b px-6 text-xs font-sans select-none shrink-0 transition-all duration-300",
      isBright 
        ? "border-slate-200/50 bg-white/94 text-slate-700" 
        : "border-slate-900 bg-[#06080d]/80 text-slate-350"
    )}>
      {/* 1. File Tab Group (with Language Icon and Status Indicators) */}
      <div className="flex items-center gap-3">
        <FileCode2 size={13} className={cn("text-violet-500", isBright ? "opacity-90" : "opacity-80")} />
        <span className={cn("font-mono font-bold tracking-wide", isBright ? "text-slate-850" : "text-slate-200")}>
          {filename}
        </span>
        <div className="w-px h-3.5 bg-slate-200/60 dark:bg-slate-800" />
        
        {/* Dynamic File status indicators */}
        <div className="flex items-center gap-1.5 select-none font-mono text-[9px] uppercase tracking-wider h-4">
          {fileStatus === 'saved' && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <Check size={9} strokeWidth={3} /> Saved
            </span>
          )}
          {fileStatus === 'editing' && (
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Editing
            </span>
          )}
          {fileStatus === 'submitting' && (
            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
              <Loader2 size={10} className="animate-spin" /> Uploading...
            </span>
          )}
        </div>
      </div>

      {/* 2. Grouped Dropdowns (Language | Theme) - Lightweight, borderless text selection */}
      <div className="flex items-center gap-4 text-[10.5px]">
        {/* Language select option */}
        <div className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          <Cpu size={12} className="text-slate-400" />
          <select
            value={activeLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-transparent text-slate-800 dark:text-slate-350 text-[11px] font-bold cursor-pointer outline-none border-none pr-1 py-1"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang} className="bg-white dark:bg-slate-950">{getLangAbbreviation(lang)} ▼</option>
            ))}
          </select>
        </div>

        {/* Theme select option */}
        <div className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          <Palette size={12} className="text-slate-400" />
          <select
            value={activeTheme}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="bg-transparent text-slate-800 dark:text-slate-350 text-[11px] font-bold cursor-pointer outline-none border-none pr-1 py-1"
          >
            {themes.map((t) => (
              <option key={t} value={t} className="bg-white dark:bg-slate-950">{getThemeAbbreviation(t)} ▼</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Actions Button Group - Rely on surface contrast with micro-animations */}
      <div className="flex items-center gap-2.5">
        <button 
          onClick={onReset}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-transparent text-[11px] font-bold cursor-pointer transition-all duration-200 hover:translate-y-[-1px] active:translate-y-0",
            isBright 
              ? "bg-slate-100/80 text-slate-600 hover:bg-slate-200/60 hover:text-slate-800 hover:shadow-sm" 
              : "bg-slate-950/60 text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          )}
          title="Reset Code"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>

        <button 
          onClick={onRun}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-transparent text-[11px] font-bold cursor-pointer transition-all duration-200 hover:translate-y-[-1px] active:translate-y-0",
            isBright 
              ? "bg-slate-100/80 text-slate-600 hover:bg-slate-200/60 hover:text-slate-800 hover:shadow-sm" 
              : "bg-slate-950/60 text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          )}
          title="Run Code"
        >
          <Play size={11} />
          <span>Run</span>
        </button>

        {/* Primary Action Button: submit animation with purple gradients & keyboard hints */}
        <button 
          onClick={handleSubmitClick}
          disabled={submitState !== 'idle'}
          className={cn(
            "flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-bold text-white cursor-pointer transition-all duration-200 active:scale-95 border-none select-none disabled:opacity-90 disabled:cursor-not-allowed",
            submitState === 'success'
              ? "bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.35)]"
              : "bg-gradient-to-r from-[#7C3AED] to-[#A855F7] shadow-[0_0_15px_rgba(124,58,237,0.35)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:translate-y-[-1px] active:translate-y-0"
          )}
          title="Submit Solution (Ctrl+Enter)"
        >
          {submitState === 'idle' && (
            <>
              <CheckSquare size={11} />
              <span>Submit</span>
              <span className="opacity-60 text-[9px] font-mono font-normal ml-0.5 bg-white/20 px-1 py-0.5 rounded leading-none shrink-0">Ctrl+Enter</span>
            </>
          )}
          {submitState === 'loading' && (
            <>
              <Loader2 size={11} className="animate-spin" />
              <span>Uploading...</span>
            </>
          )}
          {submitState === 'success' && (
            <>
              <Check size={11} strokeWidth={3} />
              <span>Submitted ✓</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
