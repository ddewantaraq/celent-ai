import 'dotenv/config';
import express from 'express';
import { mastra } from './mastra/index';

const app = express();
app.use(express.json());

// Example endpoint to trigger the weather workflow
app.post('/weather', async (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mastra + Expresss server running on port ${PORT}`);
}); 