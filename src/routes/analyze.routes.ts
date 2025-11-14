import { Router, Request, Response } from 'express';
import { uploadImage, uploadAudio } from '../middleware/upload.middleware';
import geminiService from '../services/gemini.service';
import { AnalyzeImageResponse, AnalyzeAudioResponse } from '../types';

const router = Router();

// Default prompts
const DEFAULT_IMAGE_PROMPT = 'Describe esta imagen en detalle, identificando objetos, escenas, colores, y cualquier texto visible.';
const DEFAULT_AUDIO_PROMPT = 'Transcribe este audio y proporciona un resumen de su contenido.';

/**
 * POST /api/analyze-image
 * Analyze an uploaded image using Gemini AI
 */
router.post('/analyze-image', uploadImage.single('image'), async (req: Request, res: Response) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided',
      } as AnalyzeImageResponse);
    }

    // Get prompt from request body or use default
    const prompt = req.body.prompt?.trim() || DEFAULT_IMAGE_PROMPT;

    // Validate prompt length
    if (prompt.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Prompt exceeds maximum length of 2000 characters',
      } as AnalyzeImageResponse);
    }

    // Analyze image with Gemini
    const result = await geminiService.analyzeImage(
      req.file.buffer,
      req.file.mimetype,
      prompt
    );

    // Send successful response
    return res.json({
      success: true,
      result,
    } as AnalyzeImageResponse);
  } catch (error) {
    console.error('Error in analyze-image route:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    } as AnalyzeImageResponse);
  }
});

/**
 * POST /api/analyze-audio
 * Analyze an uploaded audio file using Gemini AI
 */
router.post('/analyze-audio', uploadAudio.single('audio'), async (req: Request, res: Response) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file provided',
      } as AnalyzeAudioResponse);
    }

    // Get prompt from request body or use default
    const prompt = req.body.prompt?.trim() || DEFAULT_AUDIO_PROMPT;

    // Validate prompt length
    if (prompt.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Prompt exceeds maximum length of 2000 characters',
      } as AnalyzeAudioResponse);
    }

    // Analyze audio with Gemini
    const result = await geminiService.analyzeAudio(
      req.file.buffer,
      req.file.mimetype,
      prompt
    );

    // Send successful response
    return res.json({
      success: true,
      result,
    } as AnalyzeAudioResponse);
  } catch (error) {
    console.error('Error in analyze-audio route:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    } as AnalyzeAudioResponse);
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    const geminiHealthy = await geminiService.healthCheck();

    return res.json({
      success: true,
      status: 'healthy',
      services: {
        gemini: geminiHealthy ? 'connected' : 'disconnected',
      },
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: 'Service unavailable',
    });
  }
});

export default router;
