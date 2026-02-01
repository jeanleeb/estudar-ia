import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/cadastro')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/cadastro"!</div>;
}
