import { useState } from 'react'
import { motion } from 'motion/react'
import { BookOpen, Beaker, FileText } from 'lucide-react'
import { Badge, Separator } from '@/components/ui'
import { cn } from '@/utils'
import type { Problem } from '@/types'

type Tab = 'description' | 'examples' | 'testcases'

interface ProblemPanelProps {
  problem: Problem
}

const difficultyColor = {
  easy: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  hard: 'bg-error/10 text-error border-error/20',
  insane: 'bg-error/20 text-error border-error/30',
}

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'description', label: 'Description', icon: <BookOpen size={14} /> },
  { key: 'examples', label: 'Examples', icon: <FileText size={14} /> },
  { key: 'testcases', label: 'Test Cases', icon: <Beaker size={14} /> },
]

export function ProblemPanel({ problem }: ProblemPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('description')

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-fg">{problem.title}</h2>
          <Badge variant="default" className={cn('border text-[10px]', difficultyColor[problem.difficulty])}>
            {problem.difficulty}
          </Badge>
        </div>
        <Badge variant="dot" dotColor="#6366f1" className="ml-auto text-[10px]">
          {problem.category}
        </Badge>
      </div>

      <div className="flex gap-0 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors',
              activeTab === tab.key
                ? 'text-accent border-b-2 border-accent'
                : 'text-fg-subtle hover:text-fg-muted',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
          {activeTab === 'description' && <DescriptionTab problem={problem} />}
          {activeTab === 'examples' && <ExamplesTab problem={problem} />}
          {activeTab === 'testcases' && <TestCasesTab problem={problem} />}
        </motion.div>
      </div>
    </div>
  )
}

function DescriptionTab({ problem }: { problem: Problem }) {
  return (
    <div className="space-y-4">
      <div className="prose prose-sm prose-invert max-w-none text-fg-muted">
        {problem.description.split('\n').map((line, i) => (
          <p key={i} className="mb-2 leading-relaxed">{line}</p>
        ))}
      </div>
      <Separator />
      <div>
        <h4 className="mb-2 text-xs font-semibold text-fg">Constraints</h4>
        <ul className="space-y-1">
          {problem.constraints.map((c, i) => (
            <li key={i} className="text-xs text-fg-muted">• {c}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ExamplesTab({ problem }: { problem: Problem }) {
  return (
    <div className="space-y-4">
      {problem.examples.map((ex, i) => (
        <div key={i} className="rounded-lg border border-border bg-bg-alt p-3">
          <div className="mb-1 text-xs font-medium text-fg">Example {i + 1}</div>
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-fg-subtle">Input: </span>
              <code className="rounded bg-bg px-1 py-0.5 font-mono text-fg">{ex.input}</code>
            </div>
            <div>
              <span className="text-fg-subtle">Output: </span>
              <code className="rounded bg-bg px-1 py-0.5 font-mono text-fg">{ex.output}</code>
            </div>
            {ex.explanation && (
              <div className="mt-2 text-fg-subtle">
                <span className="text-fg-subtle">Explanation: </span>
                {ex.explanation}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function TestCasesTab({ problem }: { problem: Problem }) {
  return (
    <div className="space-y-2">
      {problem.testCases.map((tc, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
          <div className={cn('h-2 w-2 rounded-full', tc.hidden ? 'bg-warning' : 'bg-success')} />
          <div className="flex-1 text-xs">
            <div className="text-fg-muted">
              <span className="text-fg-subtle">Input: </span>
              {tc.input}
            </div>
            <div className="text-fg-muted">
              <span className="text-fg-subtle">Expected: </span>
              {tc.expected}
            </div>
          </div>
          <Badge variant={tc.hidden ? 'warning' : 'success'} className="text-[10px]">
            {tc.hidden ? 'Hidden' : 'Visible'}
          </Badge>
        </div>
      ))}
    </div>
  )
}
