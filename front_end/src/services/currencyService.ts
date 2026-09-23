import type { CurrencyCode, CurrencyRate } from '../types';
import { SUPPORTED_CURRENCIES } from '../data/countriesData';

export class CurrencyService {
  public static getRates(): Record<string, CurrencyRate> {
    return SUPPORTED_CURRENCIES;
  }

  public static getRate(code: CurrencyCode): CurrencyRate {
    return SUPPORTED_CURRENCIES[code] || SUPPORTED_CURRENCIES['USD'];
  }

  /**
   * Convert amount from source currency to target currency via USD base
   */
  public static convert(amount: number, from: CurrencyCode, to: CurrencyCode): number {
    if (from === to) return amount;
    const fromRate = this.getRate(from);
    const toRate = this.getRate(to);

    // Convert from source to USD
    const amountInUSD = amount * fromRate.rateFromUSD;
    // Convert from USD to target
    const result = amountInUSD * toRate.rateToUSD;
    return result;
  }

  /**
   * Format currency nicely with symbol
   */
  public static format(
    amount: number,
    code: CurrencyCode,
    compact: boolean = false
  ): string {
    const rate = this.getRate(code);
    const symbol = rate.symbol;

    if (compact) {
      if (code === 'INR') {
        if (amount >= 10000000) return `${symbol}${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `${symbol}${(amount / 100000).toFixed(1)} L`;
      }
      if (amount >= 1000000) return `${symbol}${(amount / 1000000).toFixed(2)}M`;
      if (amount >= 1000) return `${symbol}${(amount / 1000).toFixed(1)}K`;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code === 'INR' ? 'INR' : code,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
