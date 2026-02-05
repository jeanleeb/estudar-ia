import type { Tables } from '@estuda-ai/domain';
import type { Subject } from '@/model/subjects/subject.model';

type SubjectEntity = Tables<'subjects'>;

export function mapSubjectRowToModel(row: SubjectEntity): Subject {
	return {
		id: row.id,
		name: row.name,
		emoji: row.emoji ?? undefined,
	};
}

export function mapSubjectRowsToModel(rows: SubjectEntity[]): Subject[] {
	return rows.map(mapSubjectRowToModel);
}
