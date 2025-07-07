import { mastra } from '../../mastra';

export async function findCandidateService({ query, suspendedStep }: { query: string, suspendedStep?: string[] }) {
  const workflow = mastra.getWorkflow('extractTalentInfoWorkflow');
  let run, result: any = {};

  // Start a new workflow run
  run = await workflow.createRunAsync();

  if (!suspendedStep || suspendedStep.length === 0) {
    result = await run.start({ inputData: { query } });
  } else {
    // resume
    result = await run.resume({ step: suspendedStep, resumeData: { query } });
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