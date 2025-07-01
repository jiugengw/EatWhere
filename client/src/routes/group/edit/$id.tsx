import { EditGroupPage } from '@/pages/Group/EditGroup/EditGroup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/group/edit/$id')({
  component: EditGroupPage,
})

