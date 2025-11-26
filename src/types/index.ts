export interface AnalyzeImageRequest {
  file: Express.Multer.File;
  prompt?: string;
}

export interface AnalyzeImageResponse {
  success: boolean;
  result?: string;
  error?: string;
}

export interface GeminiImageData {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export interface AppConfig {
  port: number;
  geminiApiKey: string;
  geminiModel: string;
  maxFileSize: number;
  allowedImageTypes: string[];
  allowedAudioTypes: string[];
  maxAudioSize: number;
  corsOrigin: string;
  nodeEnv: string;
}

export interface AnalyzeAudioRequest {
  file: Express.Multer.File;
  prompt?: string;
}

export interface AnalyzeAudioResponse {
  success: boolean;
  result?: string;
  error?: string;
}

export interface GeminiAudioData {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export interface CurrencyConversionRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  date?: string; // Optional: YYYY-MM-DD format for historical rates
}

export interface CurrencyConversionResponse {
  success: boolean;
  result?: {
    amount: number;
    fromCurrency: string;
    toCurrency: string;
    convertedAmount: number;
    exchangeRate: number;
    date?: string; // Date used for conversion (current date if not specified)
  };
  error?: string;
}

export interface ExchangeRateData {
  provider: string;
  WARNING_UPGRADE_TO_V6?: string;
  terms: string;
  base: string;
  date: string;
  time_last_updated: number;
  rates: {
    [key: string]: number;
  };
}

export interface FrankfurterRateData {
  amount: number;
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}
