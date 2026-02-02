import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthPageWrapper } from '@/components/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	AlertCircleIcon,
	EyeIcon,
	EyeOffIcon,
	InfoIcon,
} from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { H1, Small, Text } from '@/components/ui/typography';
import { translations } from '@/locales';
import { loginSchema } from '@/model/auth.model';
import { loginFn } from '@/server/functions/auth';

const strings = translations.login;

export const Route = createFileRoute('/(auth)/login')({
	component: RouteComponent,
});

type LoginFormValues = z.infer<typeof loginSchema> & { rememberMe: boolean };

function RouteComponent() {
	const [showPassword, setShowPassword] = useState(false);

	const {
		mutate: login,
		isPending: isLoading,
		error,
	} = useMutation({
		mutationFn: loginFn,
	});

	const returnUrl = '';

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema.extend({ rememberMe: z.boolean() })),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	});

	const handleSubmit = (values: LoginFormValues) => {
		login({ data: { email: values.email, password: values.password } });
	};

	return (
		<AuthPageWrapper
			title={strings.page.title}
			subtitle={strings.page.subtitle}
			cardTitle={strings.card.title}
			cardDescription={strings.card.description}
			cardFooter={
				<Small>
					{strings.footer.noAccount}{' '}
					<Link
						to="/cadastro"
						className="font-medium text-primary hover:underline">
						{translations.login.footer.signUp}
					</Link>
				</Small>
			}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
					{returnUrl && (
						<Alert>
							<InfoIcon className="h-4 w-4" />
							<AlertDescription>{strings.alerts.returnUrl}</AlertDescription>
						</Alert>
					)}

					{error && (
						<Alert variant="destructive">
							<AlertCircleIcon className="h-4 w-4" />
							<AlertDescription>{error.message}</AlertDescription>
						</Alert>
					)}

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{strings.form.email.label}</FormLabel>
								<FormControl>
									<Input type="email" disabled={isLoading} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>{strings.form.password.label}</FormLabel>
									<Link
										to="/recuperar-senha"
										className="text-primary text-sm hover:underline">
										{strings.form.password.forgotPassword}
									</Link>
								</div>
								<FormControl>
									<div className="relative">
										<Input
											type={showPassword ? 'text' : 'password'}
											disabled={isLoading}
											{...field}
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground">
											{showPassword ? (
												<EyeOffIcon className="h-4 w-4" />
											) : (
												<EyeIcon className="h-4 w-4" />
											)}
										</button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="rememberMe"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center space-x-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel className="cursor-pointer">
										{strings.form.rememberMe.label}
									</FormLabel>
								</div>
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? (
							<>
								<Spinner className="mr-2 h-4 w-4 animate-spin" />
								{strings.form.submit.loading}
							</>
						) : (
							strings.form.submit.label
						)}
					</Button>
				</form>
			</Form>
			<CardFooter className="flex justify-center">
				<Small></Small>
			</CardFooter>
		</AuthPageWrapper>
	);
}
