import type { PropsWithChildren } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { H1, Text } from '@/components/ui/typography';

interface AuthPageWrapperProps extends PropsWithChildren {
	title: string;
	subtitle: string;
	cardTitle: string;
	cardDescription: string;
	cardFooter?: React.ReactNode;
}

export function AuthPageWrapper({
	title,
	subtitle,
	cardTitle,
	cardDescription,
	cardFooter,
	children,
}: AuthPageWrapperProps) {
	return (
		<div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md">
				<div className="mb-8 text-center">
					<H1 align="center">{title}</H1>
					<Text align="center" variant="muted">
						{subtitle}
					</Text>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>{cardTitle}</CardTitle>
						<CardDescription>{cardDescription}</CardDescription>
					</CardHeader>

					<CardContent>{children}</CardContent>

					{cardFooter && (
						<CardFooter className="flex justify-center">
							{cardFooter}
						</CardFooter>
					)}
				</Card>

				{/*<Text className="mt-8 text-center" variant="subtle">
					By signing in, you agree to our{' '}
					<Link to="/terms" className="text-primary hover:underline">
						Terms of Service
					</Link>{' '}
					and{' '}
					<Link to="/privacy" className="text-primary hover:underline">
						Privacy Policy
					</Link>
				</Text>*/}
			</div>
		</div>
	);
}
