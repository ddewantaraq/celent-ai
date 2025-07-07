import 'dotenv/config';
import express from 'express';
import { mastra } from './mastra/index';
import authRoutes from './routes/auth';
import { authenticateJWT } from './middleware/auth';
import sequelize from './config/database';

const app = express();
app.use(express.json());

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

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    app.listen(PORT, () => {
      console.log(`Mastra + Expresss server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})(); 