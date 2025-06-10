import express from 'express';
import dotenv from 'dotenv';
import authRoutes from '@routes/auth.routes';
import walletRoutes from '@routes/wallet.routes';
import { errorHandler } from '@middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@config/swagger';
import { AppError } from '@utils/errors';
import { env } from '@config/environment';
import { assignRequestId } from '@middleware/requestId.middleware';
import { requestLogger } from '@middleware/logger.middleware';

const app = express();
app.use(express.json());

app.use(assignRequestId);
app.use(requestLogger);

// Swagger UI
if (env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Routes
app.use('/', authRoutes);
app.use('/wallets', walletRoutes);

// 404 fallback
app.use((_req, _res, next) => {
  const err = new AppError('Route not found', 404);
  next(err);
});

// Error handler
app.use(errorHandler);

export default app;
