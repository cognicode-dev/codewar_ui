import type { Activity, ChatMessage } from '@/types'

export const recentActivity: Activity[] = [
  { id: 1, userId: 1, username: 'sen_07', action: 'submitted solution', target: 'Two Sum', timestamp: '2024-01-15T10:30:00Z' },
  { id: 2, userId: 2, username: 'aryan_01', action: 'passed test case 3', target: 'Two Sum', timestamp: '2024-01-15T10:28:00Z' },
  { id: 3, userId: 3, username: 'dev_knight', action: 'joined the arena', timestamp: '2024-01-15T10:25:00Z' },
  { id: 4, userId: 4, username: 'code_wizard', action: 'switched to', target: 'TypeScript', timestamp: '2024-01-15T10:22:00Z' },
  { id: 5, userId: 1, username: 'sen_07', action: 'started problem', target: 'Two Sum', timestamp: '2024-01-15T10:20:00Z' },
]

export const chatMessages: ChatMessage[] = [
  { id: 1, userId: 1, username: 'sen_07', content: 'Anyone got the hash map approach?', timestamp: '2024-01-15T10:29:00Z', type: 'message' },
  { id: 2, userId: 2, username: 'aryan_01', content: 'Yeah, O(n) with Map', timestamp: '2024-01-15T10:29:30Z', type: 'message' },
  { id: 3, userId: 0, username: 'System', content: 'sen_07 submitted a solution', timestamp: '2024-01-15T10:30:00Z', type: 'submit' },
  { id: 4, userId: 3, username: 'dev_knight', content: 'Nice! Let me check', timestamp: '2024-01-15T10:30:30Z', type: 'message' },
  { id: 5, userId: 4, username: 'code_wizard', content: 'I\'m going with brute force first', timestamp: '2024-01-15T10:31:00Z', type: 'message' },
]
