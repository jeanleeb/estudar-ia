import { createFileRoute, Link } from '@tanstack/react-router';
import { useReducer, useState } from 'react';
import { ExamsList, SubjectsList } from '@/components/home';
import { FeatureCard, HeroSection } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
	BookOpenIcon,
	BrainIcon,
	SparklesIcon,
	TargetIcon,
} from '@/components/ui/icon';
import { H1 } from '@/components/ui/typography';
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

	return (
		<div className="min-h-screen bg-background">
			<HeroSection
				badge={{
					icon: <SparklesIcon size="xs" />,
					text: translations.home.hero.badge,
					variant: 'secondary',
				}}
				title={translations.home.hero.title}
				description={translations.home.hero.description}
			/>

			<section className="container mx-auto px-4 py-12 md:py-16">
				<div className="mx-auto max-w-4xl">
					<div className="mb-12">
						<ExamsList
							selectedExam={selectedExam}
							setSelectedExam={setSelectedExam}
						/>
					</div>

					<div className="mb-12">
						<SubjectsList
							selectedSubjects={selectedSubjects}
							toggleSubject={toggleSubject}
						/>
					</div>

					<div className="flex justify-center">
						<Link disabled={!canStartPractice} to={'/simulado'}>
							<Button
								size="lg"
								disabled={!canStartPractice}
								className="text-base">
								{canStartPractice
									? translations.home.actions.startPractice
									: translations.home.actions.selectToBegin}
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="border-border border-t bg-muted/30 py-16">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-4xl">
						<H1 className="mb-12 text-center">
							{translations.home.features.title}
						</H1>
						<div className="grid gap-8 md:grid-cols-3">
							<FeatureCard
								icon={<BrainIcon size="xl" className="text-primary" />}
								iconBgColor="bg-primary/10"
								title={translations.home.features.aiHints.title}
								description={translations.home.features.aiHints.description}
							/>
							<FeatureCard
								icon={<TargetIcon size="xl" className="text-secondary" />}
								iconBgColor="bg-secondary/10"
								title={translations.home.features.targetedPractice.title}
								description={
									translations.home.features.targetedPractice.description
								}
							/>
							<FeatureCard
								icon={
									<BookOpenIcon size="xl" className="text-accent-foreground" />
								}
								iconBgColor="bg-accent"
								title={translations.home.features.detailedSolutions.title}
								description={
									translations.home.features.detailedSolutions.description
								}
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
