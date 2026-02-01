import { useSuspenseQuery } from '@tanstack/react-query';
import { EmptyCheck, QueryBoundary } from '@/components/boundaries';
import { TargetIcon } from '@/components/ui/icon';
import { SectionHeader } from '@/components/ui/typography';
import { translations } from '@/locales';
import { getExamsFn } from '@/server/functions/exams';
import { ExamSelectionCard } from './exam-selection-card';
import { ExamSelectionCardShimmer } from './exam-selection-card.shimmer';

function ExamsListContent({
	selectedExam,
	setSelectedExam,
}: {
	selectedExam: string;
	setSelectedExam: (id: string) => void;
}) {
	const { data: exams } = useSuspenseQuery({
		queryKey: ['exams'],
		queryFn: () => getExamsFn(),
	});

	return (
		<EmptyCheck
			isEmpty={!exams || exams.length === 0}
			fallbackProps={{
				title: translations.home.examSelection.empty.title,
				description: translations.home.examSelection.empty.description,
			}}>
			<div className="grid gap-4 md:grid-cols-2">
				{exams?.map(exam => (
					<ExamSelectionCard
						key={exam.id}
						id={exam.id}
						name={exam.name}
						description={exam.description as string}
						selected={selectedExam === exam.id}
						onSelect={() => setSelectedExam(exam.id)}
					/>
				))}
			</div>
		</EmptyCheck>
	);
}

export function ExamsList({
	selectedExam,
	setSelectedExam,
}: {
	selectedExam: string;
	setSelectedExam: (id: string) => void;
}) {
	return (
		<>
			<SectionHeader
				icon={<TargetIcon size="md" className="text-primary" />}
				iconBgColor="bg-primary/10"
				title={translations.home.examSelection.title}
				subtitle={translations.home.examSelection.subtitle}
			/>
			<QueryBoundary
				loadingFallback={
					<div className="grid gap-4 md:grid-cols-2">
						<ExamSelectionCardShimmer />
						<ExamSelectionCardShimmer />
					</div>
				}
				errorFallbackProps={{
					title: translations.home.examSelection.error.title,
					description: translations.home.examSelection.error.description,
					retryLabel: translations.common.error.retryButton,
				}}>
				<ExamsListContent
					selectedExam={selectedExam}
					setSelectedExam={setSelectedExam}
				/>
			</QueryBoundary>
		</>
	);
}
