import { createServerFn } from '@tanstack/react-start';
import { ExamsDbDataSource } from '@/server/data/db';

export const getExamsFn = createServerFn({ method: 'GET' }).handler(() => {
	return ExamsDbDataSource.findAllExams();
});
