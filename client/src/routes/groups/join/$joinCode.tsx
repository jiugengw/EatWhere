import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/groups/join/$joinCode')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/groups/join/$joinCode"!</div>
}
