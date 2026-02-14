import { createFileRoute, Link } from '@tanstack/react-router';
import { useReducer, useState } from 'react';
import { ExamsList, SubjectsList } from '@/components/home';
import { FeatureCard, HeroSection } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
	BookOpenIcon,
	BrainIcon,
	ChevronDownIcon,
	SparklesIcon,
	TargetIcon,
} from '@/components/ui/icon';
import { H2, Muted } from '@/components/ui/typography';
import { translations } from '@/locales';
import { getExamsFn } from '@/server/functions/exams';

export const Route = createFileRoute('/')({
	loader: () => getExamsFn(),
	component: HomePage,
});

function HomePage() {
	const [selectedExam, setSelectedExam] = useState<string>('');
	const [selectedSubjects, toggleSubject] = useReducer(
		(state: string[], subjectId: string) => {
			if (state.includes(subjectId)) {
				return state.filter(id => id !== subjectId);
			}
			return [...state, subjectId];
		},
		[],
	);

	const canStartPractice = selectedSubjects.length > 0 && selectedExam;
	const t = translations.home;

	return (
		<div className="min-h-screen bg-background">
			<HeroSection
				backgroundClassName="hero-grid-pattern bg-gradient-to-b from-primary/[0.03] via-background to-background dark:from-primary/[0.08]"
				badge={{
					icon: <SparklesIcon size="xs" />,
					text: t.hero.badge,
					variant: 'secondary',
				}}
				title={t.hero.title}
				description={t.hero.description}
				containerClassName="py-20 md:py-28">
				<div className="mt-8 flex animate-delay-450 animate-fade-up flex-col items-center gap-1">
					<Muted>{t.hero.scrollHint}</Muted>
					<ChevronDownIcon
						size="sm"
						className="animate-bounce-subtle text-muted-foreground"
					/>
				</div>
			</HeroSection>

			<section className="container mx-auto px-4 py-12 md:py-16">
				<div className="mx-auto max-w-4xl">
					{/* Step 1: Exames */}
					<div className="mb-12">
						<div className="flex items-start gap-4">
							<span className="hidden shrink-0 font-bold font-mono text-5xl text-primary/10 md:block">
								{t.steps.exam.number}
							</span>
							<div className="min-w-0 flex-1">
								<ExamsList
									selectedExam={selectedExam}
									setSelectedExam={setSelectedExam}
								/>
							</div>
						</div>
					</div>

					{/* Visual connector */}
					<div className="flex justify-center py-2">
						<div className="h-10 border-border border-l-2 border-dashed" />
					</div>

					{/* Step 2: Matérias */}
					<div className="mb-12">
						<div className="flex items-start gap-4">
							<span className="hidden shrink-0 font-bold font-mono text-5xl text-secondary/10 md:block">
								{t.steps.subjects.number}
							</span>
							<div className="min-w-0 flex-1">
								<SubjectsList
									selectedSubjects={selectedSubjects}
									toggleSubject={toggleSubject}
								/>
							</div>
						</div>
					</div>

					{/* Visual connector */}
					<div className="flex justify-center py-2">
						<div className="h-10 border-border border-l-2 border-dashed" />
					</div>

					{/* Step 3: CTA */}
					<div className="py-8 text-center">
						<span className="hidden font-bold font-mono text-5xl text-primary/10 md:inline-block">
							{t.steps.start.number}
						</span>
						<H2 className="mt-2 text-center">{t.steps.start.title}</H2>
						<Muted className="text-center">{t.steps.start.subtitle}</Muted>
						<div className="mt-4">
							<Link disabled={!canStartPractice} to={'/simulado'}>
								<Button
									size="lg"
									disabled={!canStartPractice}
									className="text-base transition-transform hover:scale-105">
									{canStartPractice
										? t.actions.startPractice
										: t.actions.selectToBegin}
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="border-border border-t bg-muted/30 py-12">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-4xl">
						<H2 className="mb-8 text-center">{t.features.title}</H2>
						<div className="grid gap-6 md:grid-cols-3">
							<FeatureCard
								icon={<BrainIcon size="xl" className="text-primary" />}
								iconBgColor="bg-primary/10"
								title={t.features.aiHints.title}
								description={t.features.aiHints.description}
							/>
							<FeatureCard
								icon={<TargetIcon size="xl" className="text-secondary" />}
								iconBgColor="bg-secondary/10"
								title={t.features.targetedPractice.title}
								description={t.features.targetedPractice.description}
							/>
							<FeatureCard
								icon={
									<BookOpenIcon size="xl" className="text-accent-foreground" />
								}
								iconBgColor="bg-accent"
								title={t.features.detailedSolutions.title}
								description={t.features.detailedSolutions.description}
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
