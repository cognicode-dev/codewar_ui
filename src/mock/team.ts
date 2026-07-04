import type { User, Team } from '@/types'

export const teamMembers: User[] = [
  {
    id: 1,
    username: 'sen_07',
    status: 'typing',
  },
  {
    id: 2,
    username: 'aryan_01',
    status: 'online',
  },
  {
    id: 3,
    username: 'dev_knight',
    status: 'idle',
  },
  {
    id: 4,
    username: 'code_wizard',
    status: 'online',
  },
]

export const currentTeam: Team = {
  id: 1,
  name: 'Syntax Sorcerers',
  members: teamMembers,
  score: 2847,
  rank: 3,
}
