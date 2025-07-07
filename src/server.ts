import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { mastra } from './mastra/index';
import authRoutes from './routes/auth';
import { authenticateJWT } from './middleware/auth';
import sequelize from './config/database';
import candidateRoutes from './routes/candidate';

const app = express();
app.use(express.json());

// Security middlewares
app.use(cors());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
}));

// Example endpoint to trigger the weather workflow
app.post('/weather', authenticateJWT, async (req, res) => {
  try {
    const input = req.body;
    const workflow = mastra.getWorkflow('weatherWorkflow');
    const run = await workflow.createRunAsync();
    const result = await run.start({ inputData: input });
    return res.json({ success: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ success: false, error: message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    app.listen(PORT, () => {
      console.log(`Celent AI server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})(); 