import { JoinGroupPage } from '@/pages/Group/JoinGroup/JoinGroup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/group/join')({
  component: JoinGroupPage,
})
