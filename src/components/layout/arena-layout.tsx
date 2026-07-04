import { type ReactNode } from 'react'

interface ArenaLayoutProps {
  sidebar?: ReactNode
  topNav?: ReactNode
  problemPanel?: ReactNode
  editorPanel?: ReactNode
  teamPanel?: ReactNode
  activityPanel?: ReactNode
  footer?: ReactNode
}

export function ArenaLayout({ sidebar, topNav, problemPanel, editorPanel, teamPanel, activityPanel, footer }: ArenaLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {topNav && <header className="flex-shrink-0">{topNav}</header>}
      <div className="flex flex-1 overflow-hidden">
        {sidebar && <aside className="w-[104px] flex-shrink-0">{sidebar}</aside>}
        <main className="flex flex-1 overflow-hidden">
          <section className="ambient-material flex w-[360px] flex-shrink-0 flex-col overflow-hidden border-r border-border bg-bg">
            {problemPanel}
          </section>
          <section className="ambient-material flex flex-1 flex-col overflow-hidden bg-bg">
            {editorPanel}
          </section>
          <aside className="ambient-material flex w-[360px] flex-shrink-0 flex-col overflow-hidden border-l border-border bg-bg">
            {teamPanel}
            {activityPanel}
          </aside>
        </main>
      </div>
      {footer && <footer className="flex-shrink-0">{footer}</footer>}
    </div>
  )
}
