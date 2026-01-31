import { createFileRoute, Link } from '@tanstack/react-router';
import { BookOpen, Brain, Sparkles, Target } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { t } from '@/locales';

export const Route = createFileRoute('/')({ component: HomePage });

const subjects = [
	{
		id: 'physics',
		name: t.home.subjects.physics,
		icon: '⚛️',
		color: 'bg-blue-500',
	},
	{
		id: 'portuguese',
		name: t.home.subjects.portuguese,
		icon: '📚',
		color: 'bg-green-500',
	},
	{
		id: 'history',
		name: t.home.subjects.history,
		icon: '🏛️',
		color: 'bg-amber-500',
	},
	{
		id: 'math',
		name: t.home.subjects.math,
		icon: '📐',
		color: 'bg-purple-500',
	},
];

const exams = [
	{
		id: 'enem',
		name: t.home.exams.enem.name,
		description: t.home.exams.enem.description,
	},
	{
		id: 'fuvest',
		name: t.home.exams.fuvest.name,
		description: t.home.exams.fuvest.description,
	},
];

function HomePage() {
	const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
	const [selectedExam, setSelectedExam] = useState<string>('');

	const toggleSubject = (subjectId: string) => {
		setSelectedSubjects(prev =>
			prev.includes(subjectId)
				? prev.filter(id => id !== subjectId)
				: [...prev, subjectId],
		);
	};

	const canStartPractice = selectedSubjects.length > 0 && selectedExam;

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-border border-b bg-card">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
								<Brain className="h-6 w-6 text-primary-foreground" />
							</div>
							<span className="font-semibold text-foreground text-xl">
								{t.common.app.name}
							</span>
						</div>
						<nav className="hidden gap-6 md:flex">
							<Button variant="ghost" size="sm">
								{t.common.navigation.practice}
							</Button>
							<Button variant="ghost" size="sm">
								{t.common.navigation.progress}
							</Button>
							<Button variant="ghost" size="sm">
								{t.common.navigation.about}
							</Button>
						</nav>
						<Button size="sm">{t.common.navigation.signIn}</Button>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="border-border border-b bg-card">
				<div className="container mx-auto px-4 py-16 md:py-24">
					<div className="mx-auto max-w-3xl text-center">
						<Badge variant="secondary" className="mb-4">
							<Sparkles className="mr-1 h-3 w-3" />
							{t.home.hero.badge}
						</Badge>
						<h1 className="mb-6 text-balance font-bold text-4xl text-foreground md:text-6xl">
							{t.home.hero.title}
						</h1>
						<p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
							{t.home.hero.description}
						</p>
					</div>
				</div>
			</section>

			{/* Selection Section */}
			<section className="container mx-auto px-4 py-12 md:py-16">
				<div className="mx-auto max-w-4xl">
					{/* Exam Selection */}
					<div className="mb-12">
						<div className="mb-6 flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<Target className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h2 className="font-semibold text-2xl text-foreground">
									{t.home.examSelection.title}
								</h2>
								<p className="text-muted-foreground text-sm">
									{t.home.examSelection.subtitle}
								</p>
							</div>
						</div>
						<div className="grid gap-4 md:grid-cols-2">
							{exams.map(exam => (
								<Card
									key={exam.id}
									className={`cursor-pointer border-2 p-6 transition-all hover:shadow-lg ${
										selectedExam === exam.id
											? 'border-primary bg-primary/5'
											: 'border-border bg-card hover:border-primary/50'
									}`}
									onClick={() => setSelectedExam(exam.id)}>
									<div className="flex items-start justify-between">
										<div>
											<h3 className="mb-1 font-semibold text-card-foreground text-lg">
												{exam.name}
											</h3>
											<p className="text-muted-foreground text-sm">
												{exam.description}
											</p>
										</div>
										{selectedExam === exam.id && (
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
												<svg
													className="h-4 w-4 text-primary-foreground"
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													viewBox="0 0 24 24"
													stroke="currentColor">
													<title>Checkmark</title>
													<path d="M5 13l4 4L19 7" />
												</svg>
											</div>
										)}
									</div>
								</Card>
							))}
						</div>
					</div>

					{/* Subject Selection */}
					<div className="mb-12">
						<div className="mb-6 flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
								<BookOpen className="h-5 w-5 text-secondary" />
							</div>
							<div>
								<h2 className="font-semibold text-2xl text-foreground">
									{t.home.subjectSelection.title}
								</h2>
								<p className="text-muted-foreground text-sm">
									{t.home.subjectSelection.subtitle}
								</p>
							</div>
						</div>
						<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
							{subjects.map(subject => (
								<Card
									key={subject.id}
									className={`cursor-pointer border-2 p-6 text-center transition-all hover:shadow-lg ${
										selectedSubjects.includes(subject.id)
											? 'border-primary bg-primary/5'
											: 'border-border bg-card hover:border-primary/50'
									}`}
									onClick={() => toggleSubject(subject.id)}>
									<div className="mb-3 text-4xl">{subject.icon}</div>
									<h3 className="mb-2 font-semibold text-card-foreground">
										{subject.name}
									</h3>
									{selectedSubjects.includes(subject.id) && (
										<Badge className="mt-2" variant="default">
											{t.common.actions.selected}
										</Badge>
									)}
								</Card>
							))}
						</div>
					</div>

					{/* Start Button */}
					<div className="flex justify-center">
						<Link disabled={!canStartPractice} to={'/simulado'}>
							<Button
								size="lg"
								disabled={!canStartPractice}
								className="h-12 px-8 text-base">
								{canStartPractice
									? t.home.actions.startPractice
									: t.home.actions.selectToBegin}
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="border-border border-t bg-muted/30 py-16">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-4xl">
						<h2 className="mb-12 text-center font-bold text-3xl text-foreground">
							{t.home.features.title}
						</h2>
						<div className="grid gap-8 md:grid-cols-3">
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
									<Brain className="h-8 w-8 text-primary" />
								</div>
								<h3 className="mb-2 font-semibold text-foreground text-lg">
									{t.home.features.aiHints.title}
								</h3>
								<p className="text-pretty text-muted-foreground text-sm">
									{t.home.features.aiHints.description}
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
									<Target className="h-8 w-8 text-secondary" />
								</div>
								<h3 className="mb-2 font-semibold text-foreground text-lg">
									{t.home.features.targetedPractice.title}
								</h3>
								<p className="text-pretty text-muted-foreground text-sm">
									{t.home.features.targetedPractice.description}
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
									<BookOpen className="h-8 w-8 text-accent-foreground" />
								</div>
								<h3 className="mb-2 font-semibold text-foreground text-lg">
									{t.home.features.detailedSolutions.title}
								</h3>
								<p className="text-pretty text-muted-foreground text-sm">
									{t.home.features.detailedSolutions.description}
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
