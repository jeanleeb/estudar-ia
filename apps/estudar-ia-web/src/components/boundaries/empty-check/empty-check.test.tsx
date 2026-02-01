import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@/test/mocks';
import { translations } from '@/locales';
import { EmptyCheck } from './index';

describe('EmptyCheck', () => {
	describe('Conditional Logic', () => {
		it('should render children when isEmpty is false', () => {
			render(
				<EmptyCheck isEmpty={false}>
					<div data-testid="content">Conteúdo</div>
				</EmptyCheck>,
			);

			expect(screen.getByTestId('content')).toBeInTheDocument();
			expect(
				screen.queryByText(translations.common.empty.title),
			).not.toBeInTheDocument();
		});

		it('should render default EmptyFallback when isEmpty is true', () => {
			render(
				<EmptyCheck isEmpty={true}>
					<div data-testid="content">Conteúdo</div>
				</EmptyCheck>,
			);

			expect(screen.queryByTestId('content')).not.toBeInTheDocument();
			expect(
				screen.getByText(translations.common.empty.title),
			).toBeInTheDocument();
		});

		it('should render children when isEmpty is false even with fallbackProps', () => {
			render(
				<EmptyCheck isEmpty={false} fallbackProps={{ title: 'Custom Title' }}>
					<div data-testid="content">Conteúdo</div>
				</EmptyCheck>,
			);

			expect(screen.getByTestId('content')).toBeInTheDocument();
			expect(screen.queryByText('Custom Title')).not.toBeInTheDocument();
		});
	});

	describe('Default Fallback with Props', () => {
		it('should pass fallbackProps to EmptyFallback', () => {
			const customTitle = 'Nenhum item';
			const customDescription = 'Adicione um novo item';

			render(
				<EmptyCheck
					isEmpty={true}
					fallbackProps={{
						title: customTitle,
						description: customDescription,
					}}>
					<div>Conteúdo</div>
				</EmptyCheck>,
			);

			expect(screen.getByText(customTitle)).toBeInTheDocument();
			expect(screen.getByText(customDescription)).toBeInTheDocument();
		});

		it('should pass children via fallbackProps to EmptyFallback', () => {
			render(
				<EmptyCheck
					isEmpty={true}
					fallbackProps={{
						children: (
							<button type="button" data-testid="action-button">
								Criar
							</button>
						),
					}}>
					<div>Conteúdo</div>
				</EmptyCheck>,
			);

			expect(screen.getByTestId('action-button')).toBeInTheDocument();
		});
	});

	describe('Custom Fallback', () => {
		it('should render custom fallback when provided', () => {
			const CustomFallback = () => (
				<div data-testid="custom-fallback">Custom Empty State</div>
			);

			render(
				<EmptyCheck isEmpty={true} fallback={<CustomFallback />}>
					<div>Conteúdo</div>
				</EmptyCheck>,
			);

			expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
			expect(
				screen.queryByText(translations.common.empty.title),
			).not.toBeInTheDocument();
		});

		it('should prioritize custom fallback over fallbackProps', () => {
			const CustomFallback = () => (
				<div data-testid="custom-fallback">Custom</div>
			);

			render(
				<EmptyCheck
					isEmpty={true}
					fallback={<CustomFallback />}
					fallbackProps={{ title: 'Should not appear' }}>
					<div>Conteúdo</div>
				</EmptyCheck>,
			);

			expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
			expect(screen.queryByText('Should not appear')).not.toBeInTheDocument();
		});
	});

	describe('Real World Scenarios', () => {
		it('should work with empty array', () => {
			const items: string[] = [];

			render(
				<EmptyCheck isEmpty={!items.length}>
					<ul>
						{items.map(item => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</EmptyCheck>,
			);

			expect(
				screen.getByText(translations.common.empty.title),
			).toBeInTheDocument();
		});

		it('should work with array containing data', () => {
			const items = ['Item 1', 'Item 2'];

			render(
				<EmptyCheck isEmpty={!items.length}>
					<ul>
						{items.map(item => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</EmptyCheck>,
			);

			expect(screen.getByText('Item 1')).toBeInTheDocument();
			expect(screen.getByText('Item 2')).toBeInTheDocument();
			expect(
				screen.queryByText(translations.common.empty.title),
			).not.toBeInTheDocument();
		});
	});
});
