export const home = {
	hero: {
		badge: 'Aprendizado com IA',
		title: 'Domine Seus Exames com Prática Inteligente',
		description:
			'Pratique milhares de questões de vestibular com dicas e soluções fornecidas por IA. Receba orientação personalizada quando precisar, domine conceitos no seu próprio ritmo.',
		scrollHint: 'Comece abaixo',
	},
	steps: {
		exam: { number: '01' },
		subjects: { number: '02' },
		start: {
			number: '03',
			title: 'Comece a Praticar',
			subtitle: 'Tudo pronto! Inicie sua sessão de estudo personalizada.',
		},
	},
	examSelection: {
		title: 'Escolha Seu Exame',
		subtitle: 'Selecione o exame para o qual você está se preparando',
		error: {
			title: 'Erro ao carregar exames',
			description: 'Não foi possível carregar a lista de exames.',
		},
		empty: {
			title: 'Nenhum exame disponível',
			description: 'Não há exames cadastrados no momento.',
		},
	},
	subjectSelection: {
		title: 'Selecione as Matérias',
		subtitle: 'Escolha uma ou mais matérias para praticar',
		error: {
			title: 'Erro ao carregar matérias',
			description: 'Não foi possível carregar a lista de matérias.',
		},
		empty: {
			title: 'Nenhuma matéria disponível',
			description: 'Não há matérias cadastradas no momento.',
		},
	},
	subjects: {
		physics: 'Física',
		portuguese: 'Português',
		history: 'História',
		math: 'Matemática',
	},
	exams: {
		enem: {
			name: 'ENEM',
			description: 'Exame Nacional do Ensino Médio',
		},
		fuvest: {
			name: 'Fuvest',
			description: 'Vestibular da USP',
		},
	},
	actions: {
		startPractice: 'Iniciar Sessão de Prática',
		selectToBegin: 'Selecione os exames e as matérias para começar',
	},
	features: {
		title: 'Por que Praticar com o EstudarIA?',
		aiHints: {
			title: 'Dicas com IA',
			description:
				'Receba dicas inteligentes quando estiver travado sem revelar a solução completa',
		},
		targetedPractice: {
			title: 'Prática Direcionada',
			description:
				'Foque em matérias e exames específicos para maximizar sua eficiência de estudo',
		},
		detailedSolutions: {
			title: 'Soluções Detalhadas',
			description:
				'Acesse soluções completas passo a passo para entender profundamente cada conceito',
		},
	},
} as const;
