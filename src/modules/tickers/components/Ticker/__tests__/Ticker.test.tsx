import { render, screen, fireEvent } from '@testing-library/react';
import Ticker from '../Ticker';
import { vi } from "vitest";

vi.mock(import("@modules/reference-data/utils"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
  }
});

const onClickMock = jest.fn();

describe('Ticker', () => {
    const defaultProps = {
        currencyPair: 'BTCUSD',
        isActive: true,
        lastPrice: 45000,
        dailyChange: 1250,
        dailyChangeRelative: 2.85,
        onClick: onClickMock
    };

    it('should render currency pair correctly', () => {
        render(<Ticker {...defaultProps} />);
        expect(screen.getByText(/btc \/ usd/i)).toBeInTheDocument();
    })

    it('should format price with 2 decimal places', () => {
        render(<Ticker {...defaultProps} />);
        expect(screen.getByText('45,000.00')).toBeInTheDocument();
    });

    it('should display positive change in green', () => {
        render(<Ticker {...defaultProps} />);

        const relativeChangeElement = screen.getByTestId('relative-change');
        expect(relativeChangeElement).toHaveClass('relative-change__positive');
    });

    it('should display negative change in red', () => {
        const negativeProps = {
            ...defaultProps,
            dailyChange: -1250,
            dailyChangeRelative: -2.85
        };

        render(<Ticker {...negativeProps} />);

        const relativeChangeElement = screen.getByTestId('relative-change');
        expect(relativeChangeElement).toHaveClass('relative-change__negative');
    })

    it('should handle click events', () => {
        render(<Ticker {...defaultProps} />)

        fireEvent.click(screen.getByRole('button'));
        expect(onClickMock).toHaveBeenCalled();
    })

    it('should handle missing data gracefully', () => {
        const incompleteProps = {
            currencyPair: 'BTCUSD',
            lastPrice: undefined,
            dailyChange: undefined,
            dailyChangeRelative: undefined,
            isActive: true,
            onClick: onClickMock
        } as any;

        render(<Ticker {...incompleteProps} />);

        expect(screen.getByText('BTC / USD')).toBeInTheDocument();
    });
});