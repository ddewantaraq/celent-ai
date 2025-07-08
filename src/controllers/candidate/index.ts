import { Request, Response } from "express";
import {
  findCandidateService,
  getAllCandidatesService,
  saveCandidateService,
} from "../../services/candidate";

export const findCandidate = async (req: Request, res: Response) => {
  try {
    const { query, suspendedStep } = req.body;
    const result = await findCandidateService({ query, suspendedStep });
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
