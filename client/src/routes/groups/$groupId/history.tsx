import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/groups/$groupId/history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/groups/$groupId/history"!</div>
}
