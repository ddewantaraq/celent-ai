import { Agent } from '@mastra/core/agent';
import { groq } from '@ai-sdk/groq';
import { celentMemory } from '../memory';

export const extractTalentInfoAgent = new Agent({
  name: 'Talent Info Extractor',
  description: 'Extracts job title, platform, and location from a user query. If not mentioned, returns "not provided".',
  instructions: `
    Extract the following information from the user query:
    - Job title (e.g., designer, engineer, marketer)
    - Platform (YouTube, TikTok, LinkedIn)
    - Location (city, region, or country)
    If any of these are not mentioned, return 'not provided' for that field.
    If user asks to retrieve last conversation in any question format, 
    please return the last information that user already given.
    Utilize memory to retrieve the last conversation and return the same format like describe above
    If there are any description that relevant to be included (experience, skillset, etc)
    please include it as additional description.
    Respond only with a JSON object with keys: jobTitle, platform, location, additionalDescription.
  `,
  model: groq('llama-3.3-70b-versatile'),
  memory: celentMemory
});
