import { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils'

interface ResizablePanelsProps {
  leftPanel: React.ReactNode
  centerPanel: React.ReactNode
  rightPanel: React.ReactNode
  isBright?: boolean
}

export function ResizablePanels({
  leftPanel,
  centerPanel,
  rightPanel,
  isBright = false,
}: ResizablePanelsProps) {
  const [leftWidth, setLeftWidth] = useState(380)
  const [rightWidth, setRightWidth] = useState(300)
  
  const isDraggingLeft = useRef(false)
  const isDraggingRight = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  // Left Divider Drag Handler
  const handleLeftMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingLeft.current = true
    startX.current = e.clientX
    startWidth.current = leftWidth
    document.addEventListener('mousemove', handleLeftMouseMove)
    document.addEventListener('mouseup', handleLeftMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const handleLeftMouseMove = (e: MouseEvent) => {
    if (!isDraggingLeft.current) return
    const deltaX = e.clientX - startX.current
    const newWidth = startWidth.current + deltaX
    if (newWidth >= 280 && newWidth <= 600) {
      setLeftWidth(newWidth)
    }
  }

  const handleLeftMouseUp = () => {
    if (isDraggingLeft.current) {
      isDraggingLeft.current = false
      document.removeEventListener('mousemove', handleLeftMouseMove)
      document.removeEventListener('mouseup', handleLeftMouseUp)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }
  }

  // Right Divider Drag Handler
  const handleRightMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingRight.current = true
    startX.current = e.clientX
    startWidth.current = rightWidth
    document.addEventListener('mousemove', handleRightMouseMove)
    document.addEventListener('mouseup', handleRightMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const handleRightMouseMove = (e: MouseEvent) => {
    if (!isDraggingRight.current) return
    // Dragging divider left (positive deltaX) decreases right panel width
    const deltaX = e.clientX - startX.current
    const newWidth = startWidth.current - deltaX
    if (newWidth >= 240 && newWidth <= 450) {
      setRightWidth(newWidth)
    }
  }

  const handleRightMouseUp = () => {
    if (isDraggingRight.current) {
      isDraggingRight.current = false
      document.removeEventListener('mousemove', handleRightMouseMove)
      document.removeEventListener('mouseup', handleRightMouseUp)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }
  }

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleLeftMouseMove)
      document.removeEventListener('mouseup', handleLeftMouseUp)
      document.removeEventListener('mousemove', handleRightMouseMove)
      document.removeEventListener('mouseup', handleRightMouseUp)
    }
  }, [])

  return (
    <div className="flex-1 flex overflow-hidden w-full h-full relative">
      {/* 1. Left Problem Panel Column */}
      <div 
        style={{ width: `${leftWidth}px` }} 
        className="flex-shrink-0 h-full overflow-hidden"
      >
        {leftPanel}
      </div>

      {/* Left Resizer handle line */}
      <div 
        onMouseDown={handleMouseDownWrapper(handleLeftMouseDown)}
        className={cn(
          "w-[5px] h-full cursor-col-resize z-20 hover:bg-violet-500/20 active:bg-violet-500/40 transition-colors flex-shrink-0 border-r border-l border-transparent",
          isBright ? "hover:border-slate-300/30" : "hover:border-slate-800/30"
        )}
      />

      {/* 2. Center Monaco Editor Column */}
      <div className="flex-1 h-full overflow-hidden min-w-0">
        {centerPanel}
      </div>

      {/* Right Resizer handle line */}
      <div 
        onMouseDown={handleMouseDownWrapper(handleRightMouseDown)}
        className={cn(
          "w-[5px] h-full cursor-col-resize z-20 hover:bg-violet-500/20 active:bg-violet-500/40 transition-colors flex-shrink-0 border-r border-l border-transparent",
          isBright ? "hover:border-slate-300/30" : "hover:border-slate-800/30"
        )}
      />

      {/* 3. Right Lobby Sidebar Column */}
      <div 
        style={{ width: `${rightWidth}px` }} 
        className="flex-shrink-0 h-full overflow-hidden"
      >
        {rightPanel}
      </div>
    </div>
  )

  // Small helper to prevent React double triggers
  function handleMouseDownWrapper(callback: (e: React.MouseEvent) => void) {
    return (e: React.MouseEvent) => callback(e)
  }
}
