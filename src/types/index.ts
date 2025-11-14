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
  allowedMimeTypes: string[];
  corsOrigin: string;
  nodeEnv: string;
}
