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
    const { name, profileUrl, platform, summary } = req.body;
    if (!name || !profileUrl || !platform || !summary) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const candidate = await saveCandidateService({
      name,
      profileUrl,
      platform,
      summary,
    });
    return res.status(201).json(candidate);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidate = await getAllCandidatesService();
    return res.status(201).json(candidate);
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
