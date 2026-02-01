import { supabaseClient } from './supabase.client';

export const SubjectsDbDataSource = {
	async findAllSubjects() {
		const { data, error } = await supabaseClient()
			.from('subjects')
			.select(`
        *
      `)
			.order('name');

		if (error) {
			console.error('Erro no Repositório (Subjects):', error);
			throw new Error('Falha ao carregar matérias do banco de dados.');
		}

		return data;
	},
};
