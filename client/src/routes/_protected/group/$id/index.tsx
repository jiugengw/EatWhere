import { GroupDetailPage } from '@/pages/Group/GroupDetails/GroupDetails'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/group/$id/')({
  component: GroupDetailPage,
})

