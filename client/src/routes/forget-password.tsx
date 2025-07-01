import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forget-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/forget-password"!</div>
}
