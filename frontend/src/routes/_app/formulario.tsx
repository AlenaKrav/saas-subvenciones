import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/formulario')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/formulario"!</div>
}
