import { JoinGroupPage } from '@/pages/Group/JoinGroup/JoinGroup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/group/join')({
  component: JoinGroupPage,
})
