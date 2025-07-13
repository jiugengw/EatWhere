import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/recommendations/explore')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/recommendations/explore"!</div>
}
