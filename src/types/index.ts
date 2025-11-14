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
