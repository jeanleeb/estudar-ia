export const validation = {
	auth: {
		email: {
			required: 'Insira seu email',
			invalid: 'Email inválido',
		},
		password: {
			required: 'Insira sua senha',
			minLength: 'A senha deve ter no mínimo 6 caracteres',
			uppercase: 'A senha deve conter pelo menos uma letra maiúscula',
			lowercase: 'A senha deve conter pelo menos uma letra minúscula',
			number: 'A senha deve conter pelo menos um número',
			symbol: 'A senha deve conter pelo menos um símbolo',
		},
		confirmPassword: {
			required: 'Confirme sua senha',
			mismatch: 'As senhas não coincidem',
		},
		name: {
			required: 'Insira seu nome completo',
			minLength: 'O nome deve ter no mínimo 2 caracteres',
		},
		terms: {
			required: 'Você deve aceitar os termos e condições',
		},
	},
};
