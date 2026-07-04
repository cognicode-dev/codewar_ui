import { ResizablePanels } from './ResizablePanels'
import { cn } from '@/utils'

interface ArenaLayoutProps {
  topNav: React.ReactNode
  sidebar: React.ReactNode
  problemPanel: React.ReactNode
  editorToolbar: React.ReactNode
  codeEditor: React.ReactNode
  lobbySidebar: React.ReactNode
  consolePanel: React.ReactNode
  isBright?: boolean
}

export function ArenaLayout({
  topNav,
  sidebar,
  problemPanel,
  editorToolbar,
  codeEditor,
  lobbySidebar,
  consolePanel,
  isBright = false,
}: ArenaLayoutProps) {
  // Center Column has Toolbar + Editor stacked vertically
  const centerContent = (
    <div className="flex flex-col h-full overflow-hidden w-full">
      {editorToolbar}
      {codeEditor}
    </div>
  )

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden select-none bg-transparent font-sans">
      {/* 1. Full-Width Top Navigation */}
      <div className="flex-shrink-0 w-full">
        {topNav}
      </div>

      {/* 2. Main content viewport area */}
      <div className="flex flex-1 overflow-hidden w-full relative">
        {/* Left Floating Sidebar Spacer */}
        {sidebar && (
          <aside className="w-[120px] flex-shrink-0 h-full relative z-30">
            {sidebar}
          </aside>
        )}

        {/* Content wrapper with problem, editor, lobby, and console panel */}
        <div className="flex-grow flex flex-col h-full overflow-hidden relative">
          
          {/* Main Three-Column Splitter */}
          <div className="flex-1 overflow-hidden min-h-0 w-full">
            <ResizablePanels 
              leftPanel={problemPanel}
              centerPanel={centerContent}
              rightPanel={lobbySidebar}
              isBright={isBright}
            />
          </div>

          {/* Bottom Console Panel (full width underneath the columns) */}
          <div className="flex-shrink-0 w-full">
            {consolePanel}
          </div>
        </div>
      </div>
    </div>
  )
}
