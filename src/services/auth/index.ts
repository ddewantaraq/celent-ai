import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1d';

export async function registerUser({ fullname, email, password }: { fullname: string, email: string, password: string }) {
  if (!fullname || !email || !password) {
    throw new Error('All fields are required.');
  }
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered.');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ fullname, email, password: hashedPassword } as any);
  return { message: 'User registered successfully.' };
}

export async function loginUser({ email, password }: { email: string, password: string }) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials.');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials.');
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return {
    token,
    user: { id: user.id, fullname: user.fullname, email: user.email }
  };
}
