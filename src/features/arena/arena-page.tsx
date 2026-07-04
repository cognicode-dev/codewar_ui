import { motion } from 'motion/react'
import { Code2, Users, MessageSquare, BarChart3, BookOpen } from 'lucide-react'
import { ArenaLayout } from '@/components/layout'
import { TopNavigation } from '@/components/navigation/top-navigation'
import { FloatingSidebar } from '@/components/sidebar/floating-sidebar'
import { ProblemPanel } from './problem-panel'
import { EditorPanel } from './editor-panel'
import { TeamPanel } from './team-panel'
import { ActivityFeed } from './activity-feed'
import { BottomToolbar } from './bottom-toolbar'
import { currentProblem } from '@/mock/problem'
import { currentTeam } from '@/mock/team'
import { recentActivity, chatMessages } from '@/mock/activity'
import { defaultEditorSettings } from '@/mock/editor'
import { motion as motionTokens } from '@/theme/motion'

const sidebarItems = [
  { icon: <Code2 size={16} />, label: 'Problems', active: true },
  { icon: <Users size={16} />, label: 'Team' },
  { icon: <MessageSquare size={16} />, label: 'Chat' },
  { icon: <BarChart3 size={16} />, label: 'Analytics' },
  { icon: <BookOpen size={16} />, label: 'Notes' },
]

export function ArenaPage() {
  return (
    <ArenaLayout
      sidebar={
        <FloatingSidebar items={sidebarItems} />
      }
      topNav={<TopNavigation />}
      problemPanel={
        <motion.div
          initial={motionTokens.panel.initial}
          animate={motionTokens.panel.animate}
          transition={{ duration: motionTokens.panel.duration / 1000, ease: 'easeOut' }}
          className="h-full"
        >
          <ProblemPanel problem={currentProblem} />
        </motion.div>
      }
      editorPanel={
        <EditorPanel
          starterCode={currentProblem.starterCode}
          settings={defaultEditorSettings}
        />
      }
      teamPanel={
        <TeamPanel team={currentTeam} />
      }
      activityPanel={
        <ActivityFeed activities={recentActivity} messages={chatMessages} />
      }
      footer={<BottomToolbar />}
    />
  )
}
