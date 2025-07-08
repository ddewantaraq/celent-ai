import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { extractTalentInfoWorkflow } from './workflows/extract-talent-info-workflow';
import { storage } from './memory';

export const mastra = new Mastra({
  workflows: { weatherWorkflow, extractTalentInfoWorkflow },
  agents: { weatherAgent },
  storage: storage,
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  server: {
    port: process.env.MASTRA_PORT ? Number(process.env.MASTRA_PORT) : 4111,
    host: '0.0.0.0',
  },
});
