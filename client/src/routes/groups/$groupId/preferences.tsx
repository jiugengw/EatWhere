import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/groups/$groupId/preferences')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/groups/$groupId/preferences"!</div>
}
