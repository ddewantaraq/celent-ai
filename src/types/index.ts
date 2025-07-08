import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any; // or specify the type of your JWT payload
}