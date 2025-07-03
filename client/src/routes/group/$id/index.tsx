import { GroupDetailPage } from '@/pages/Group/GroupDetails/GroupDetails'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/group/$id/')({
  component: GroupDetailPage,
})

