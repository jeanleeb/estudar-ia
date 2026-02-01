import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@/test/mocks';
import { translations } from '@/locales';
import { EmptyFallback } from './empty-fallback';

describe('Component - EmptyFallback', () => {
	describe('Rendering', () => {
		it('should render with default translations when no props are provided', () => {
			render(<EmptyFallback />);

			expect(
				screen.getByText(translations.common.empty.title),
			).toBeInTheDocument();
			expect(
				screen.getByText(translations.common.empty.description),
			).toBeInTheDocument();
		});

		it('should render with custom title', () => {
			const customTitle = 'Nenhum item encontrado';
			render(<EmptyFallback title={customTitle} />);

			expect(screen.getByText(customTitle)).toBeInTheDocument();
		});

		it('should render with custom description', () => {
			const customDescription = 'Adicione seu primeiro item';
			render(<EmptyFallback description={customDescription} />);

			expect(screen.getByText(customDescription)).toBeInTheDocument();
		});

		it('should render with custom title and description', () => {
			const customTitle = 'Título Custom';
			const customDescription = 'Descrição Custom';
			render(
				<EmptyFallback title={customTitle} description={customDescription} />,
			);

			expect(screen.getByText(customTitle)).toBeInTheDocument();
			expect(screen.getByText(customDescription)).toBeInTheDocument();
		});

		it('should render default icon when no icon is provided', () => {
			render(<EmptyFallback />);
			expect(screen.getByTestId('smile-icon')).toBeInTheDocument();
		});

		it('should render custom icon', () => {
			const CustomIcon = () => (
				<span data-testid="custom-icon">CustomIcon</span>
			);
			render(<EmptyFallback icon={<CustomIcon />} />);

			expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
			expect(screen.queryByTestId('smile-icon')).not.toBeInTheDocument();
		});

		it('should render custom children', () => {
			render(
				<EmptyFallback>
					<button data-testid="create-button" type="button">
						Criar novo
					</button>
				</EmptyFallback>,
			);

			expect(screen.getByTestId('create-button')).toBeInTheDocument();
		});

		it('should render children inside a div with margin', () => {
			const { container } = render(
				<EmptyFallback>
					<button type="button">Ação</button>
				</EmptyFallback>,
			);

			const childrenWrapper = container.querySelector('.mt-4');
			expect(childrenWrapper).toBeInTheDocument();
			expect(childrenWrapper).toContainElement(screen.getByRole('button'));
		});
	});

	describe('Composition', () => {
		it('should allow full composition of props and children', () => {
			const customTitle = 'Sem resultados';
			const customDescription = 'Tente outra busca';
			const CustomIcon = () => (
				<span data-testid="search-icon">SearchIcon</span>
			);

			render(
				<EmptyFallback
					title={customTitle}
					description={customDescription}
					icon={<CustomIcon />}>
					<button type="button" data-testid="reset-button">
						Resetar filtros
					</button>
				</EmptyFallback>,
			);

			expect(screen.getByText(customTitle)).toBeInTheDocument();
			expect(screen.getByText(customDescription)).toBeInTheDocument();
			expect(screen.getByTestId('search-icon')).toBeInTheDocument();
			expect(screen.getByTestId('reset-button')).toBeInTheDocument();
		});
	});
});
