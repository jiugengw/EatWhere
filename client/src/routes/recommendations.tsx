import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recommendations')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/recommendations"!</div>
}
