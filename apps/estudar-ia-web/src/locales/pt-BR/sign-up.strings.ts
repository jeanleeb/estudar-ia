export const signUp = {
	page: {
		title: 'Crie Sua Conta',
		subtitle: 'Comece sua jornada de aprendizado hoje',
	},
	card: {
		title: 'Cadastro',
		description: 'Crie uma nova conta para começar',
	},
	form: {
		name: {
			label: 'Nome completo',
		},
		email: {
			label: 'Email',
		},
		password: {
			label: 'Senha',
		},
		confirmPassword: {
			label: 'Confirmar senha',
		},
		termsAndConditions: {
			label: 'Eu concordo com os',
			terms: 'Termos de Serviço',
			and: 'e',
			privacy: 'Política de Privacidade',
		},
		submit: {
			label: 'Criar conta',
			loading: 'Criando conta...',
		},
	},
	passwordRules: {
		title: 'Sua senha deve conter:',
		minLength: 'Mínimo de 6 caracteres',
		uppercase: 'Pelo menos uma letra maiúscula',
		lowercase: 'Pelo menos uma letra minúscula',
		number: 'Pelo menos um número',
		symbol: 'Pelo menos um símbolo',
	},
	footer: {
		hasAccount: 'Já tem uma conta?',
		signIn: 'Entrar',
	},
	alerts: {
		success: 'Conta criada com sucesso!',
		error: 'Erro ao criar conta. Tente novamente.',
	},
} as const;
