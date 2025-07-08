import { mastra } from '../../mastra';
import { RuntimeContext } from "@mastra/core/di";
import { celentMemory } from '../../mastra/memory';

export async function findCandidateService({ query, suspendedStep, user }: { query: string, suspendedStep?: string[], user: { id: number, email: string } }) {
  const workflow = mastra.getWorkflow('extractTalentInfoWorkflow');
  let run, result: any = {};

  // Start a new workflow run
  run = await workflow.createRunAsync();

  function randomString(length = 5) {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  const runtimeContext = new RuntimeContext();
  const randomStr = randomString(5);
  runtimeContext.set('thread_id', `candidate-${user.id}-${randomStr}`);
  runtimeContext.set('resource_id', `candidate-${user.email}-${user.id}`);

  if (!suspendedStep || suspendedStep.length === 0) {
    result = await run.start({ inputData: { query }, runtimeContext });
  } else {
    // resume
    result = await run.resume({ step: suspendedStep, resumeData: { query }, runtimeContext });
  }

  if (result.status === 'suspended') {
    const suspendedStep = Array.isArray(result.suspended) ? result.suspended[0] : result.suspended;

    if (!suspendedStep) {
      throw new Error('Could not determine suspended step id.');
    }
    return {
      suspended: true,
      suspendedStep: suspendedStep,
      message: 'Please re-enter your query and include job title, platform, and location.'
    };
  }

  return { success: true, result: result?.result };
}

export async function getMessageHistoryService(thread_id: string) {
  const {uiMessages} = await celentMemory.query({threadId: thread_id, selectBy: {last: 10}});
  return {messages: uiMessages};
}

export async function getRecentSearchesService(user: { id: number, email: string }) {
  const resource_id = `candidate-${user.email}-${user.id}`;
  const threads = await celentMemory.getThreadsByResourceId({
    resourceId: resource_id,
  });
  return {recentSearches: threads};
}