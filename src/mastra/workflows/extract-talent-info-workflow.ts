import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { extractTalentInfoAgent } from '../agents/talent-agent';
import { extractTalentInfoSchema } from '../schemas/extract-talent-info.schema';
import { candidateSearchAgent } from '../agents/candidate-search-agent';
import { MCPClient } from '@mastra/mcp';

const callExtractAgentStep = createStep({
  id: 'call-extract-talent-info-agent',
  description: 'Call the agent to extract job title, platform, and location from the user query',
  inputSchema: z.object({
    query: z.string(),
  }),
  outputSchema: extractTalentInfoSchema,
  suspendSchema: z.object({
    query: z.string(),
  }),
  execute: async ({ inputData, suspend, resumeData }) => {
    // If resuming, use the new query
    const query = resumeData?.query || inputData.query;
    const response = await extractTalentInfoAgent.generate(query);
    let result;
    try {
      let text = response.text;
      // Remove Markdown code block if present
      if (typeof text === 'string') {
        text = text.replace(/^```(\w*)?\n?/, '').replace(/```$/, '').trim();
        result = JSON.parse(text);
      } else {
        result = text;
      }
    } catch (e) {
      console.log('error', e);
      result = { jobTitle: 'not provided', 
        platform: 'not provided', 
        location: 'not provided',
        additionalDesc: 'not provided' 
    };
    }
    console.log("result", result);
    // If any field is 'not provided', suspend and ask user to re-enter
    if (
      !result.jobTitle || result.jobTitle === 'not provided' ||
      !result.platform || result.platform === 'not provided' ||
      !result.location || result.location === 'not provided'
    ) {
      // Suspend workflow and ask user to re-prompt (UI/caller should prompt user to re-enter query)
      await suspend({
        query: '', // user will provide new query
      });
      // The workflow will resume here with new input
      return { jobTitle: 'not provided', 
        platform: 'not provided', 
        location: 'not provided',
        additionalDesc: 'not provided' 
    };
    }
    return result;
  },
});

const candidateSchema = z.object({
  name: z.string(),
  profileUrl: z.string(),
  platform: z.string(),
  summary: z.string(),
});

const candidatesListSchema = z.object({
  candidates: z.array(candidateSchema),
});

const profileId = process.env.SMITHERY_PROFILE;
const apiKey = process.env.SMITHERY_API_KEY;
const serverName = process.env.SMITHERY_LINKEDIN_URL;

// Initialize MCP client for Smithery (singleton)
const mcp = new MCPClient({
  servers: {
    smithery: {
      url: new URL(`https://server.smithery.ai/${serverName}/mcp?api_key=${apiKey}&profile=${profileId}`),
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.SMITHERY_API_KEY}`,
        },
      },
    },
  },
});

const callCandidateSearchStep = createStep({
  id: 'call-candidate-search-agent',
  description: 'Call the agent to search for candidates using MCP Smithery tools',
  inputSchema: extractTalentInfoSchema,
  outputSchema: candidatesListSchema,
  execute: async ({ inputData, runtimeContext }) => {
    // Log runtimeContext values
    const threadId: string = runtimeContext?.get?.('thread_id');
    const resourceId: string = runtimeContext?.get?.('resource_id');
    console.log('CandidateSearchStep runtimeContext:', { threadId, resourceId });
    // Use the singleton mcp instance
    const toolsets = await mcp.getToolsets();
    console.log('searching ...')
    // Compose prompt for the agent
    const prompt = [
      'Find candidates for the following:',
      `Job Title: ${inputData.jobTitle}`,
      `Platform: ${inputData.platform}`,
      `Location: ${inputData.location}`,
      `Additional Description: ${inputData.additionalDesc}`,
      'Return a JSON array of candidates with name, profileUrl, platform, and summary.'
    ].join('\n');
    const response = await candidateSearchAgent.generate(prompt, {
      toolsets,
      output: z.array(candidateSchema),
      memory: {thread: threadId, resource: resourceId}
    });
    console.log('done ...')
    //await mcp.disconnect();
    return { candidates: response.object || [] };
  },
});

export const extractTalentInfoWorkflow = createWorkflow({
  id: 'extract-talent-info-workflow',
  description: 'Workflow to extract job title, platform, and location from a user query using the talent agent, then search for candidates using MCP Smithery tools',
  inputSchema: z.object({
    query: z.string(),
  }),
  outputSchema: candidatesListSchema,
})
  .then(callExtractAgentStep)
  .then(callCandidateSearchStep)
  .commit(); 