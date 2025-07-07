import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recommendations/explore')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/recommendations/explore"!</div>
}
