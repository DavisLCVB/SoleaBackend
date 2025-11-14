import dotenv from 'dotenv';
import { AppConfig } from '../types';

dotenv.config();

const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash', // More stable than experimental models
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default for images
  allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(','),
  allowedAudioTypes: (process.env.ALLOWED_AUDIO_TYPES || 'audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/webm').split(','),
  maxAudioSize: parseInt(process.env.MAX_AUDIO_SIZE || '10485760', 10), // 10MB default for audio
  corsOrigin: process.env.CORS_ORIGIN || '*',
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Validate required configuration
if (!config.geminiApiKey) {
  throw new Error('GEMINI_API_KEY is required in environment variables');
}

export default config;
