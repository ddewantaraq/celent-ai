import { mastra } from "../../mastra";
import { Candidate } from "../../models/Candidate";
import { RuntimeContext } from "@mastra/core/di";
import { celentMemory } from "../../mastra/memory";

export async function findCandidateService({
  query,
  suspendedStep,
  user,
  candidates,
  runId
}: {
  query: string;
  suspendedStep?: string[];
  user: { id: number; email: string };
  candidates: any[],
  runId: string
}) {
  const workflow = mastra.getWorkflow("extractTalentInfoWorkflow");
  let run,
    result: any = {};

  // Start a new/existing workflow run
  if (runId) {
    run = await workflow.createRunAsync({runId: runId});
  } else {
    run = await workflow.createRunAsync();
  }


  function randomString(length = 5) {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length);
  }

  const runtimeContext = new RuntimeContext();
  const randomStr = randomString(5);
  runtimeContext.set("thread_id", `candidate-${user.id}-${randomStr}`);
  runtimeContext.set("resource_id", `candidate-${user.email}-${user.id}`);

  if (!suspendedStep || suspendedStep.length === 0) {
    result = await run.start({ inputData: { query }, runtimeContext });
  } else {
    // resume
    let resumeData = { query }
    if (suspendedStep.length > 0) {
      const step: any = suspendedStep[0]
      if (step === 'ask-to-store-candidate') {
        resumeData = {...resumeData, ...{candidates: candidates}, ...{store: true}}
      }
    }

    result = await run.resume({
      step: suspendedStep,
      resumeData: resumeData,
      runtimeContext,
    });
  }

  if (result.status === "suspended") {
    const suspendedStep = Array.isArray(result.suspended)
      ? result.suspended[0]
      : result.suspended;

    if (!suspendedStep) {
      throw new Error("Could not determine suspended step id.");
    }

    if (result.steps[suspendedStep[0]]?.suspendPayload) {
      return {
        runId: run.runId,
        suspended: true,
        suspendedStep: suspendedStep,
        message: result.steps[suspendedStep[0]]?.suspendPayload?.message,
        result: result.steps[suspendedStep[0]]?.suspendPayload,
      };
    }
    return {
      suspended: true,
      suspendedStep: suspendedStep,
      message:
        "Please re-enter your query and include job title, platform, and location.",
    };
  }

  // store to save candidates
  await saveCandidateService({candidates: result?.result?.candidates || [], userId: user.id});

  return { success: true, result: result?.result };
}

export async function saveCandidateService({
  candidates,
  userId,
}: {
  candidates: Array<{
    name: string;
    profileUrl: string;
    platform: string;
    summary: string;
  }>;
  userId: number;
}) {
  const savedCandidates = await Promise.all(
    candidates.map((candidateData) =>
      Candidate.create({ ...candidateData, userId } as any)
    )
  );
  return savedCandidates;
}

export async function getAllCandidatesService(userId: number) {
  const candidates = await Candidate.findAll({ where: { userId } });
  return candidates;
}

export async function getMessageHistoryService(thread_id: string) {
  const { uiMessages } = await celentMemory.query({
    threadId: thread_id,
    selectBy: { last: 10 },
  });
  return { messages: uiMessages };
}

export async function getRecentSearchesService(user: {
  id: number;
  email: string;
}) {
  const resource_id = `candidate-${user.email}-${user.id}`;
  const threads = await celentMemory.getThreadsByResourceId({
    resourceId: resource_id,
  });
  return { recentSearches: threads };
}
