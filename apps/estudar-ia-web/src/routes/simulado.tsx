import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/simulado')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/simulado"!</div>;
}
