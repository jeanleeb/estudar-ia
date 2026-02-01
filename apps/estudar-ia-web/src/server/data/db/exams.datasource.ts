import { supabaseClient } from './supabase.client';

export const ExamsDbDataSource = {
	async findAllExams() {
		const { data, error } = await supabaseClient()
			.from('exams')
			.select(`
        *
      `)
			.order('name');

		if (error) {
			console.error('Erro no Repositório (Exams):', error);
			throw new Error('Falha ao carregar exames do banco de dados.');
		}

		return data;
	},
};
