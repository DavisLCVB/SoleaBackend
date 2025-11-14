import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.middleware';
import geminiService from '../services/gemini.service';
import { AnalyzeImageResponse } from '../types';

const router = Router();

// Default prompt if none provided
const DEFAULT_PROMPT = 'Describe esta imagen en detalle, identificando objetos, escenas, colores, y cualquier texto visible.';

/**
 * POST /api/analyze-image
 * Analyze an uploaded image using Gemini AI
 */
router.post('/analyze-image', upload.single('image'), async (req: Request, res: Response) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided',
      } as AnalyzeImageResponse);
    }

    // Get prompt from request body or use default
    const prompt = req.body.prompt?.trim() || DEFAULT_PROMPT;

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
    res.json({
      success: true,
      result,
    } as AnalyzeImageResponse);
  } catch (error) {
    console.error('Error in analyze-image route:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    } as AnalyzeImageResponse);
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const geminiHealthy = await geminiService.healthCheck();

    res.json({
      success: true,
      status: 'healthy',
      services: {
        gemini: geminiHealthy ? 'connected' : 'disconnected',
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: 'Service unavailable',
    });
  }
});

export default router;
