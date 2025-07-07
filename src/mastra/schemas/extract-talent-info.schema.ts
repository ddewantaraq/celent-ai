import { z } from 'zod';

export const extractTalentInfoSchema = z.object({
  jobTitle: z.string(),
  platform: z.string(),
  location: z.string(),
  additionalDesc: z.string()
}); 