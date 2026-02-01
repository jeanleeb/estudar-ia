import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/recuperar-senha')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/recuperar-senha"!</div>;
}
