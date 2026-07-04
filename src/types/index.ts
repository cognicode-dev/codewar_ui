export interface User {
  id: number
  username: string
  avatar?: string
  status: 'online' | 'offline' | 'away' | 'typing' | 'idle'
}

export interface Problem {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard' | 'insane'
  category: string
  description: string
  examples: Example[]
  constraints: string[]
  starterCode: string
  testCases: TestCase[]
}

export interface Example {
  input: string
  output: string
  explanation?: string
}

export interface TestCase {
  input: string
  expected: string
  hidden: boolean
}

export interface Submission {
  id: number
  userId: number
  problemId: number
  code: string
  language: Language
  status: SubmissionStatus
  timestamp: string
  executionTime?: number
  memoryUsed?: number
  testResults?: TestResult[]
}

export interface TestResult {
  passed: boolean
  input: string
  expected: string
  actual: string
  hidden: boolean
}

export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'rust' | 'go'

export type SubmissionStatus = 'accepted' | 'wrong_answer' | 'time_limit' | 'memory_limit' | 'runtime_error' | 'compilation_error' | 'pending' | 'running'

export interface ChatMessage {
  id: number
  userId: number
  username: string
  content: string
  timestamp: string
  type: 'message' | 'system' | 'join' | 'leave' | 'submit'
}

export interface Activity {
  id: number
  userId: number
  username: string
  action: string
  target?: string
  timestamp: string
}

export interface Team {
  id: number
  name: string
  members: User[]
  score: number
  rank: number
}

export interface EditorSettings {
  fontSize: number
  tabSize: number
  minimap: boolean
  wordWrap: boolean
  lineNumbers: boolean
  theme: 'vs-dark' | 'light'
  language: Language
}

export interface ArenaSession {
  id: string
  problem: Problem
  team: Team
  editor: EditorSettings
  startedAt: string
  timeRemaining?: number
}
