import { Request, Response } from "express";
import {
  findCandidateService,
  getAllCandidatesService,
  saveCandidateService,
  getMessageHistoryService,
  getRecentSearchesService,
} from "../../services/candidate";
import { AuthenticatedRequest } from "../../types";

export const findCandidate = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { query, suspendedStep } = req.body;
    const user = {
      id: req.user.id,
      email: req.user.email,
    };
    const result = await findCandidateService({ query, suspendedStep, user });
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const saveCandidate = async (req: Request, res: Response) => {
  try {
    const { candidates } = req.body;
    const userId = (req as any).user?.id;
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ message: "Candidates array is required." });
    }
    for (const candidate of candidates) {
      if (
        !candidate.name ||
        !candidate.profileUrl ||
        !candidate.platform ||
        !candidate.summary
      ) {
        return res.status(400).json({
          message:
            "Each candidate must have name, profileUrl, platform, and summary.",
        });
      }
    }
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user id not found." });
    }
    const savedCandidates = await saveCandidateService({ candidates, userId });
    return res.status(201).json(savedCandidates);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getCandidates = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user id not found." });
    }
    const candidates = await getAllCandidatesService(userId);
    return res.status(200).json(candidates);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getRecentSearches = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const result = await getRecentSearchesService(req.user);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getMessageHistory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { threadId } = req.query;
    const result = await getMessageHistoryService(threadId as string);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
