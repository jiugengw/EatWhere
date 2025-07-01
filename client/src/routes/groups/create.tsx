import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/groups/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/groups/create"!</div>
}
