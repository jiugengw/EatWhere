import { CreateGroupPage } from '@/pages/Group/CreateGroup/CreateGroup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/group/create')({
  component: CreateGroupPage,
})

