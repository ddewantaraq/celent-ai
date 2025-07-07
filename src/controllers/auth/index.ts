import { Request, Response } from 'express';
import { registerUser, loginUser } from '../../services/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password } = req.body;
    const result = await registerUser({ fullname, email, password });
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
