import { ExchangeRateData, FrankfurterRateData } from '../types';

class CurrencyService {
    private readonly API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest';
    private readonly FRANKFURTER_API_URL = 'https://api.frankfurter.app';
    private rateCache: Map<string, { data: ExchangeRateData; timestamp: number }> = new Map();
    private historicalCache: Map<string, FrankfurterRateData> = new Map();
    private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

    /**
     * Get exchange rates for a base currency
     * Uses caching to minimize API calls
     */
    private async getExchangeRates(baseCurrency: string): Promise<ExchangeRateData> {
        const cacheKey = baseCurrency.toUpperCase();
        const cached = this.rateCache.get(cacheKey);

        // Return cached data if still valid
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.data;
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}/${baseCurrency}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
            }

            const data = await response.json() as ExchangeRateData;

            // Cache the result
            this.rateCache.set(cacheKey, {
                data,
                timestamp: Date.now(),
            });

            return data;
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            throw new Error('Failed to fetch exchange rates from external API');
        }
    }

    /**
     * Validate currency code (must be 3-letter uppercase code)
     */
    private isValidCurrencyCode(code: string): boolean {
        return /^[A-Z]{3}$/.test(code);
    }

    /**
     * Validate date format and range
     */
    private validateDate(dateString: string): void {
        // Check format YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateString)) {
            throw new Error('Invalid date format. Use YYYY-MM-DD');
        }

        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }

        // Check if date is not in the future
        if (date > today) {
            throw new Error('Date cannot be in the future');
        }

        // Check if date is not before 1999-01-04 (Frankfurter API limit)
        const minDate = new Date('1999-01-04');
        if (date < minDate) {
            throw new Error('Historical data is only available from 1999-01-04 onwards');
        }
    }

    /**
     * Get historical exchange rates for a specific date using Frankfurter API
     */
    private async getHistoricalExchangeRates(
        baseCurrency: string,
        date: string
    ): Promise<FrankfurterRateData> {
        const cacheKey = `${baseCurrency}_${date}`;
        const cached = this.historicalCache.get(cacheKey);

        // Return cached data if available (historical data doesn't change)
        if (cached) {
            return cached;
        }

        try {
            const response = await fetch(
                `${this.FRANKFURTER_API_URL}/${date}?from=${baseCurrency}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch historical rates: ${response.statusText}`);
            }

            const data = await response.json() as FrankfurterRateData;

            // Cache the result (historical data never changes)
            this.historicalCache.set(cacheKey, data);

            return data;
        } catch (error) {
            console.error('Error fetching historical exchange rates:', error);
            throw new Error('Failed to fetch historical exchange rates from Frankfurter API');
        }
    }

    /**
     * Convert amount from one currency to another
     * Supports both current and historical rates
     */
    async convertCurrency(
        amount: number,
        fromCurrency: string,
        toCurrency: string,
        date?: string
    ): Promise<{ convertedAmount: number; exchangeRate: number; date: string }> {
        // Validate inputs
        if (amount <= 0) {
            throw new Error('Amount must be a positive number');
        }

        const from = fromCurrency.toUpperCase();
        const to = toCurrency.toUpperCase();

        if (!this.isValidCurrencyCode(from)) {
            throw new Error(`Invalid source currency code: ${fromCurrency}`);
        }

        if (!this.isValidCurrencyCode(to)) {
            throw new Error(`Invalid destination currency code: ${toCurrency}`);
        }

        // Validate date if provided
        if (date) {
            this.validateDate(date);
        }

        let exchangeRate: number;
        let conversionDate: string;

        if (date) {
            // Use historical rates from Frankfurter API
            const historicalData = await this.getHistoricalExchangeRates(from, date);

            // Check if target currency exists in the rates
            if (!historicalData.rates[to]) {
                throw new Error(`Currency ${to} not found in historical exchange rates for ${date}`);
            }

            exchangeRate = historicalData.rates[to];
            conversionDate = historicalData.date;
        } else {
            // Use current rates from exchangerate-api.com
            const exchangeData = await this.getExchangeRates(from);

            // Check if target currency exists in the rates
            if (!exchangeData.rates[to]) {
                throw new Error(`Currency ${to} not found in exchange rates`);
            }

            exchangeRate = exchangeData.rates[to];
            conversionDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD
        }
        const convertedAmount = amount * exchangeRate;

        return {
            convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimal places
            exchangeRate: Math.round(exchangeRate * 1000000) / 1000000, // Round to 6 decimal places
            date: conversionDate,
        };
    }

    /**
     * Get list of supported currencies
     */
    async getSupportedCurrencies(): Promise<string[]> {
        try {
            // Use USD as base to get all available currencies
            const exchangeData = await this.getExchangeRates('USD');
            return Object.keys(exchangeData.rates);
        } catch (error) {
            console.error('Error fetching supported currencies:', error);
            return [];
        }
    }

    /**
     * Clear the exchange rate cache
     */
    clearCache(): void {
        this.rateCache.clear();
        this.historicalCache.clear();
    }
}

export default new CurrencyService();
