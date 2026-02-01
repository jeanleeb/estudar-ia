export const login = {
	page: {
		title: 'Bem-vindo de volta',
		subtitle: 'Entre para continuar sua jornada de aprendizado',
	},
	card: {
		title: 'Entrar',
		description: 'Digite suas credenciais para acessar sua conta',
	},
	form: {
		email: {
			label: 'Email',
			validation: {
				required: 'Insira seu email',
				invalid: 'Email inválido',
			},
		},
		password: {
			label: 'Senha',
			forgotPassword: 'Esqueceu a senha?',
			show: 'Mostrar senha',
			hide: 'Ocultar senha',
			validation: {
				required: 'Insira sua senha',
			},
		},
		rememberMe: {
			label: 'Lembrar por 30 dias',
		},
		submit: {
			label: 'Entrar',
			loading: 'Entrando...',
		},
	},
	alerts: {
		returnUrl: 'Por favor, entre para continuar para a página solicitada.',
	},
	footer: {
		noAccount: 'Não tem uma conta? ',
		signUp: 'Cadastre-se',
	},
	terms: {
		prefix: 'Ao entrar, você concorda com nossos ',
		termsOfService: 'Termos de Serviço',
		and: ' e ',
		privacyPolicy: 'Política de Privacidade',
	},
} as const;
