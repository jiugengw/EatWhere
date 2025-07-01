import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/groups/join/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/groups/join/"!</div>
}
