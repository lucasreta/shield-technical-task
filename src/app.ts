import express from 'express';
import dotenv from 'dotenv';
import authRoutes from '@routes/auth.routes';
import walletRoutes from '@routes/wallet.routes';
import { errorHandler } from '@middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@config/swagger';

dotenv.config();

const app = express();
app.use(express.json());

// Swagger UI
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Routes
app.use('/signin', authRoutes);
app.use('/signout', authRoutes); // placeholder for future signout
app.use('/wallets', walletRoutes);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

export default app;
