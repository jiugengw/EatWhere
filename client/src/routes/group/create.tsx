import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/group/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/group/create"!</div>
}
