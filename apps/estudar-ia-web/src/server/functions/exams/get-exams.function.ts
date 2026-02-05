import { createServerFn } from '@tanstack/react-start';
import { ExamsDbDataSource } from '@/server/data/db';
import { mapExamRowsToModel } from './exam.mapper';

export const getExamsFn = createServerFn({ method: 'GET' }).handler(
	async () => {
		const exams = await ExamsDbDataSource.findAllExams();
		return mapExamRowsToModel(exams ?? []);
	},
);
