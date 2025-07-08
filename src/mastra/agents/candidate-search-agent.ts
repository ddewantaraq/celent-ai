import { Agent } from '@mastra/core/agent';
import { groq } from '@ai-sdk/groq';
import { celentMemory } from '../memory';

export const candidateSearchAgent = new Agent({
  name: 'Candidate Search Agent',
  description: 'Searches for candidates on a given platform and location.',
  instructions: `
    Given a job title, platform, and location, to search for relevant candidates.
    Return a list of candidates with their name, profileUrl, platform, and summary.
    If no candidates are found, return an empty list.
    Respond only with a JSON array of candidate objects.
  `,
  model: groq('llama-3.3-70b-versatile'),
  memory: celentMemory
}); 

export const storeCandidateAgent = new Agent({
  name: 'Store Candidate Agent',
  description: 'Store for candidates that users have been asked for.',
  instructions: `
    Given the user query and list of candidates, please return any candidates that user needed.
    If user asks to store all of candidates, then response JSON array of all candidates.
    If user ask for specific candidates like user might mention their nickname or fullname, 
    then response JSON array of specific candidates that user asks.
    If user does not ask any candidates to be stored, then return empty list instead.
  `,
  model: groq('llama-3.3-70b-versatile'),
  memory: celentMemory
}); 