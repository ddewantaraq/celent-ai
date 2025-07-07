import { mastra } from '../../mastra';

export async function findCandidateService({ query, runId, stepId }: { query: string, runId?: string, stepId?: string }) {
  const workflow = mastra.getWorkflow('extractTalentInfoWorkflow');
  let run, result;

  if (!runId || !stepId) {
    // Start a new workflow run
    run = await workflow.createRunAsync();
    result = await run.start({ inputData: { query } });
  } else {
    // Resume a suspended workflow run
    run = await workflow.createRunAsync({ runId });
    result = await run.resume({ step: stepId, resumeData: { query } });
  }

  if (result.status === 'suspended') {
    const suspendedStep = Array.isArray(result.suspended) ? result.suspended[0] : result.suspended;
    const stepId = suspendedStep && typeof suspendedStep === 'object' && 'id' in suspendedStep ? suspendedStep.id : undefined;
    if (!stepId) {
      throw new Error('Could not determine suspended step id.');
    }
    return {
      suspended: true,
      runId: run.runId,
      stepId,
      message: 'Please re-enter your query and include job title, platform, and location.'
    };
  }

  return { success: true, result };
} 