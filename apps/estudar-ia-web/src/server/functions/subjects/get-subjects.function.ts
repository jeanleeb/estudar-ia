import { createServerFn } from '@tanstack/react-start';
import { SubjectsDbDataSource } from '@/server/data/db';

export const getSubjectsFn = createServerFn({ method: 'GET' }).handler(() => {
	return SubjectsDbDataSource.findAllSubjects();
});
