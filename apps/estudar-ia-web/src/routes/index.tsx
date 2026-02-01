import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import {
	ExamSelectionCard,
	ExamSelectionCardShimmer,
	SubjectSelectionCard,
} from '@/components/home';
import { AppHeader, FeatureCard, HeroSection } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
	BookOpenIcon,
	BrainIcon,
	SparklesIcon,
	TargetIcon,
} from '@/components/ui/icon';
import { H2, SectionHeader } from '@/components/ui/typography';
import { t } from '@/locales';
import { getExamsFn } from '@/server/functions/exams';

export const Route = createFileRoute('/')({
	loader: () => getExamsFn(),
	component: HomePage,
});

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

function HomePage() {
	const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
	const [selectedExam, setSelectedExam] = useState<string>('');

	const { data, isLoading } = useQuery({
		queryKey: ['exams'],
		queryFn: () => getExamsFn(),
	});

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
			<AppHeader />

			<HeroSection
				badge={{
					icon: <SparklesIcon size="xs" />,
					text: t.home.hero.badge,
					variant: 'secondary',
				}}
				title={t.home.hero.title}
				description={t.home.hero.description}
			/>

			<section className="container mx-auto px-4 py-12 md:py-16">
				<div className="mx-auto max-w-4xl">
					<div className="mb-12">
						<SectionHeader
							icon={<TargetIcon size="md" className="text-primary" />}
							iconBgColor="bg-primary/10"
							title={t.home.examSelection.title}
							subtitle={t.home.examSelection.subtitle}
						/>
						<div className="grid gap-4 md:grid-cols-2">
							{isLoading ? (
								<>
									<ExamSelectionCardShimmer />
									<ExamSelectionCardShimmer />
								</>
							) : (
								data?.map(exam => (
									<ExamSelectionCard
										key={exam.id}
										id={exam.id}
										name={exam.name}
										description={exam.description as string}
										selected={selectedExam === exam.id}
										onSelect={() => setSelectedExam(exam.id)}
									/>
								))
							)}
						</div>
					</div>

					<div className="mb-12">
						<SectionHeader
							icon={<BookOpenIcon size="md" className="text-secondary" />}
							iconBgColor="bg-secondary/10"
							title={t.home.subjectSelection.title}
							subtitle={t.home.subjectSelection.subtitle}
						/>
						<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
							{subjects.map(subject => (
								<SubjectSelectionCard
									key={subject.id}
									id={subject.id}
									name={subject.name}
									icon={subject.icon}
									selected={selectedSubjects.includes(subject.id)}
									onToggle={() => toggleSubject(subject.id)}
								/>
							))}
						</div>
					</div>

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
						<H2 className="mb-12 text-center">{t.home.features.title}</H2>
						<div className="grid gap-8 md:grid-cols-3">
							<FeatureCard
								icon={<BrainIcon size="xl" className="text-primary" />}
								iconBgColor="bg-primary/10"
								title={t.home.features.aiHints.title}
								description={t.home.features.aiHints.description}
							/>
							<FeatureCard
								icon={<TargetIcon size="xl" className="text-secondary" />}
								iconBgColor="bg-secondary/10"
								title={t.home.features.targetedPractice.title}
								description={t.home.features.targetedPractice.description}
							/>
							<FeatureCard
								icon={
									<BookOpenIcon size="xl" className="text-accent-foreground" />
								}
								iconBgColor="bg-accent"
								title={t.home.features.detailedSolutions.title}
								description={t.home.features.detailedSolutions.description}
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
