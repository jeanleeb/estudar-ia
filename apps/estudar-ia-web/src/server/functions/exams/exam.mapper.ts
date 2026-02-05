import type { Tables } from '@estuda-ai/domain';
import type { Exam } from '@/model/exams/exam.model';

type ExamEntity = Tables<'exams'>;

export function mapExamRowToModel(row: ExamEntity): Exam {
	return {
		id: row.id,
		name: row.name,
		description: row.description ?? undefined,
		iconUrl: row.icon_url ?? undefined,
	};
}

export function mapExamRowsToModel(rows: ExamEntity[]): Exam[] {
	return rows.map(mapExamRowToModel);
}
