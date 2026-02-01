import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@/test/mocks';
import { translations } from '@/locales';
import { ErrorFallback } from './error-fallback';

describe('Component - ErrorFallback', () => {
	const mockError = new Error('Test error message');
	const mockOnReset = vi.fn();

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('Rendering', () => {
		it('should render with default translations when no props are provided', () => {
			render(<ErrorFallback error={mockError} onReset={mockOnReset} />);

			expect(
				screen.getByText(translations.common.error.title),
			).toBeInTheDocument();
			expect(screen.getByText(mockError.message)).toBeInTheDocument();
			const button = screen.getByRole('button');
			expect(button).toHaveTextContent(translations.common.error.retryButton);
		});

		it('should render with custom title', () => {
			const customTitle = 'Erro customizado';
			render(
				<ErrorFallback
					error={mockError}
					onReset={mockOnReset}
					title={customTitle}
				/>,
			);

			expect(screen.getByText(customTitle)).toBeInTheDocument();
		});

		it('should render with custom description', () => {
			const customDescription = 'Descrição customizada do erro';
			render(
				<ErrorFallback
					error={mockError}
					onReset={mockOnReset}
					description={customDescription}
				/>,
			);

			expect(screen.getByText(customDescription)).toBeInTheDocument();
		});

		it('should render with custom button label', () => {
			const customRetryLabel = 'Tentar de novo';
			render(
				<ErrorFallback
					error={mockError}
					onReset={mockOnReset}
					retryLabel={customRetryLabel}
				/>,
			);

			const button = screen.getByRole('button');
			expect(button).toHaveTextContent(customRetryLabel);
		});

		it('should use default description translation when error.message is empty', () => {
			const errorWithoutMessage = new Error();
			render(
				<ErrorFallback error={errorWithoutMessage} onReset={mockOnReset} />,
			);

			expect(
				screen.getByText(translations.common.error.description),
			).toBeInTheDocument();
		});

		it('should render custom children instead of default button', () => {
			render(
				<ErrorFallback error={mockError} onReset={mockOnReset}>
					<button type="button" data-testid="custom-action">
						Ação Customizada
					</button>
				</ErrorFallback>,
			);

			expect(screen.getByTestId('custom-action')).toBeInTheDocument();
			const buttons = screen.queryAllByRole('button');
			const retryButton = buttons.find(btn =>
				btn.textContent?.includes(translations.common.error.retryButton),
			);
			expect(retryButton).toBeUndefined();
		});

		it('should render error icon', () => {
			render(<ErrorFallback error={mockError} onReset={mockOnReset} />);
			expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
		});

		it('should render refresh icon in button', () => {
			render(<ErrorFallback error={mockError} onReset={mockOnReset} />);
			expect(screen.getByTestId('refresh-cw-icon')).toBeInTheDocument();
		});
	});

	describe('Interactions', () => {
		it('should call onReset when button is clicked', async () => {
			const user = userEvent.setup();
			render(<ErrorFallback error={mockError} onReset={mockOnReset} />);

			const button = screen.getByRole('button');
			await user.click(button);

			expect(mockOnReset).toHaveBeenCalledTimes(1);
		});

		it('should not call onReset when custom children are provided', () => {
			render(
				<ErrorFallback error={mockError} onReset={mockOnReset}>
					<button type="button">Custom</button>
				</ErrorFallback>,
			);

			const buttons = screen.queryAllByRole('button');
			const retryButton = buttons.find(btn =>
				btn.textContent?.includes(translations.common.error.retryButton),
			);
			expect(retryButton).toBeUndefined();
		});
	});

	describe('Accessibility', () => {
		it('should have proper semantic structure', () => {
			render(<ErrorFallback error={mockError} onReset={mockOnReset} />);

			const button = screen.getByRole('button');
			expect(button).toHaveTextContent(translations.common.error.retryButton);
		});
	});
});
