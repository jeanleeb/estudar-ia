import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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

const strings = translations.login;

export const Route = createFileRoute('/(auth)/login')({
	component: RouteComponent,
});

const loginSchema = z.object({
	email: z
		.email({ message: strings.form.email.validation.invalid })
		.min(1, { message: strings.form.email.validation.required }),
	password: z
		.string()
		.min(1, { message: strings.form.password.validation.required }),
	rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function RouteComponent() {
	const [showPassword, setShowPassword] = useState(false);

	const returnUrl = '';
	const error = null;
	const isLoading = false;

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	});

	const handleSubmit = (_values: LoginFormValues) => {
		// TODO: Implement login logic
	};

	return (
		<div>
			<div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
				<div className="w-full max-w-md">
					<div className="mb-8 text-center">
						<H1 align="center">{strings.page.title}</H1>
						<Text align="center" variant="muted" className="mt-2">
							{strings.page.subtitle}
						</Text>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>{strings.card.title}</CardTitle>
							<CardDescription>{strings.card.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(handleSubmit)}
									className="space-y-4">
									{returnUrl && (
										<Alert>
											<InfoIcon className="h-4 w-4" />
											<AlertDescription>
												{strings.alerts.returnUrl}
											</AlertDescription>
										</Alert>
									)}

									{error && (
										<Alert variant="destructive">
											<AlertCircleIcon className="h-4 w-4" />
											<AlertDescription>{error}</AlertDescription>
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
						</CardContent>
						<CardFooter className="flex justify-center">
							<Small>
								{strings.footer.noAccount}{' '}
								<Link
									to="/cadastro"
									className="font-medium text-primary hover:underline">
									{translations.login.footer.signUp}
								</Link>
							</Small>
						</CardFooter>
					</Card>

					{/*<p className="mt-8 text-center text-muted-foreground text-xs">
						By signing in, you agree to our{' '}
						<Link to="/terms" className="text-primary hover:underline">
							Terms of Service
						</Link>{' '}
						and{' '}
						<Link to="/privacy" className="text-primary hover:underline">
							Privacy Policy
						</Link>
					</p>*/}
				</div>
			</div>
		</div>
	);
}
