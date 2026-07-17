import express from 'express';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import contractRoutes from './routes/contractRoutes.js';
import reviewsRoutes from './routes/reviewsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api', reviewsRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;