import { Agent } from '@mastra/core/agent';
import { groq } from '@ai-sdk/groq';

export const candidateSearchAgent = new Agent({
  name: 'Candidate Search Agent',
  description: 'Searches for candidates on a given platform and location using MCP tools.',
  instructions: `
    Given a job title, platform, and location, use the available MCP tools to search for relevant candidates.
    Return a list of candidates with their name, profileUrl, platform, and summary.
    If no candidates are found, return an empty list.
    Respond only with a JSON array of candidate objects.
  `,
  model: groq('llama-3.3-70b-versatile'),
}); 