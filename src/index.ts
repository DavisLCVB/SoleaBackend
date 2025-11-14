import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import config from './config';
import analyzeRoutes from './routes/analyze.routes';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api', analyzeRoutes);

// Root route - serve index.html
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server only in development (Vercel handles this in production)
if (process.env.NODE_ENV !== 'production') {
  app.listen(config.port, () => {
    console.log(`
🚀 Server running on port ${config.port}
🌍 Environment: ${config.nodeEnv}
📁 Serving static files from: ${path.join(__dirname, '../public')}
🤖 Gemini Model: ${config.geminiModel}
    `);

    if (config.nodeEnv === 'development') {
      console.log(`🔗 Open http://localhost:${config.port} in your browser`);
    }
  });
}

// Export for Vercel serverless
export default app;
