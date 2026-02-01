import { useSuspenseQuery } from '@tanstack/react-query';
import { EmptyCheck, QueryBoundary } from '@/components/boundaries';
import { BookOpenIcon } from '@/components/ui/icon';
import { SectionHeader } from '@/components/ui/typography';
import { translations } from '@/locales';
import { getSubjectsFn } from '@/server/functions/subjects';
import { SubjectSelectionCard } from './subject-selection-card';
import { SubjectSelectionCardShimmer } from './subject-selection-card.shimmer';

function SubjectsListContent({
	selectedSubjects,
	toggleSubject,
}: {
	selectedSubjects: string[];
	toggleSubject: (id: string) => void;
}) {
	const { data: subjects } = useSuspenseQuery({
		queryKey: ['subjects'],
		queryFn: () => getSubjectsFn(),
	});

	return (
		<EmptyCheck
			isEmpty={!subjects || subjects.length === 0}
			fallbackProps={{
				title: translations.home.subjectSelection.empty.title,
				description: translations.home.subjectSelection.empty.description,
			}}>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{subjects?.map(subject => (
					<SubjectSelectionCard
						key={subject.id}
						id={subject.id}
						name={subject.name}
						icon={subject.emoji || '📚'}
						selected={selectedSubjects.includes(subject.id)}
						onToggle={() => toggleSubject(subject.id)}
					/>
				))}
			</div>
		</EmptyCheck>
	);
}

export function SubjectsList({
	selectedSubjects,
	toggleSubject,
}: {
	selectedSubjects: string[];
	toggleSubject: (id: string) => void;
}) {
	return (
		<>
			<SectionHeader
				icon={<BookOpenIcon size="md" className="text-primary" />}
				iconBgColor="bg-primary/10"
				title={translations.home.subjectSelection.title}
				subtitle={translations.home.subjectSelection.subtitle}
			/>
			<QueryBoundary
				loadingFallback={
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<SubjectSelectionCardShimmer />
						<SubjectSelectionCardShimmer />
						<SubjectSelectionCardShimmer />
						<SubjectSelectionCardShimmer />
					</div>
				}
				errorFallbackProps={{
					title: translations.home.subjectSelection.error.title,
					description: translations.home.subjectSelection.error.description,
					retryLabel: translations.common.error.retryButton,
				}}>
				<SubjectsListContent
					selectedSubjects={selectedSubjects}
					toggleSubject={toggleSubject}
				/>
			</QueryBoundary>
		</>
	);
}
