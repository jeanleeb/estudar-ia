import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { AuthPageWrapper } from '@/components/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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
	CheckCircleIcon,
	CircleIcon,
	EyeIcon,
	EyeOffIcon,
} from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Small } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { translations } from '@/locales';
import { signUpSchema, validatePasswordRule } from '@/model/auth.model';
import { signUpFn } from '@/server/functions/auth';

const strings = translations.signUp;

export const Route = createFileRoute('/(auth)/cadastro')({
	component: RouteComponent,
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface PasswordRule {
	label: string;
	validator: (password: string) => boolean;
}

const passwordRules: PasswordRule[] = [
	{
		label: strings.passwordRules.minLength,
		validator: (pwd: string) => validatePasswordRule(pwd, 'minLength'),
	},
	{
		label: strings.passwordRules.uppercase,
		validator: (pwd: string) => validatePasswordRule(pwd, 'uppercase'),
	},
	{
		label: strings.passwordRules.lowercase,
		validator: (pwd: string) => validatePasswordRule(pwd, 'lowercase'),
	},
	{
		label: strings.passwordRules.number,
		validator: (pwd: string) => validatePasswordRule(pwd, 'number'),
	},
	{
		label: strings.passwordRules.symbol,
		validator: (pwd: string) => validatePasswordRule(pwd, 'symbol'),
	},
];

function RouteComponent() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		mutate: signUp,
		isPending: isLoading,
		error,
	} = useMutation({
		mutationFn: signUpFn,
	});

	const form = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const password = form.watch('password');

	const handleSubmit = (values: SignUpFormValues) => {
		signUp({ data: values });
	};

	return (
		<AuthPageWrapper
			title={strings.page.title}
			subtitle={strings.page.subtitle}
			cardTitle={strings.card.title}
			cardDescription={strings.card.description}
			cardFooter={
				<Small align="center">
					{strings.footer.hasAccount}{' '}
					<Link
						to="/login"
						className="font-medium text-primary hover:underline">
						{strings.footer.signIn}
					</Link>
				</Small>
			}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertCircleIcon className="h-4 w-4" />
							<AlertDescription>{error.message}</AlertDescription>
						</Alert>
					)}

					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{strings.form.name.label}</FormLabel>
								<FormControl>
									<Input type="text" disabled={isLoading} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

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
								<FormLabel>{strings.form.password.label}</FormLabel>
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

					{password && (
						<div className="space-y-2 rounded-md border border-border bg-muted/50 p-3">
							<p className="font-medium text-muted-foreground text-sm">
								{strings.passwordRules.title}
							</p>
							<ul className="space-y-1.5">
								{passwordRules.map((rule, index) => {
									const isValid = rule.validator(password);
									return (
										<li
											key={index}
											className={cn(
												'flex items-center gap-2 text-sm transition-colors',
												isValid
													? 'text-green-600 dark:text-green-400'
													: 'text-muted-foreground',
											)}>
											{isValid ? (
												<CheckCircleIcon className="h-4 w-4 shrink-0" />
											) : (
												<CircleIcon className="h-4 w-4 shrink-0" />
											)}
											<span>{rule.label}</span>
										</li>
									);
								})}
							</ul>
						</div>
					)}

					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{strings.form.confirmPassword.label}</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											type={showConfirmPassword ? 'text' : 'password'}
											disabled={isLoading}
											{...field}
										/>
										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
											className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground">
											{showConfirmPassword ? (
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
		</AuthPageWrapper>
	);
}
