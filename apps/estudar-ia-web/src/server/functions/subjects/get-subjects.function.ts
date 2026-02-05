import { createServerFn } from '@tanstack/react-start';
import { SubjectsDbDataSource } from '@/server/data/db';
import { mapSubjectRowsToModel } from './subject.mapper';

export const getSubjectsFn = createServerFn({ method: 'GET' }).handler(
	async () => {
		const subjects = await SubjectsDbDataSource.findAllSubjects();

		return mapSubjectRowsToModel(subjects ?? []);
	},
);
