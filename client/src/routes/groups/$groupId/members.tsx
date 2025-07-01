import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/groups/$groupId/members')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/groups/$groupId/members"!</div>
}
