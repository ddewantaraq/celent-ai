import { Request, Response } from 'express';
import { findCandidateService } from '../../services/candidate';

export const findCandidate = async (req: Request, res: Response) => {
  try {
    const { query, runId, stepId } = req.body;
    const result = await findCandidateService({ query, runId, stepId });
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}; 