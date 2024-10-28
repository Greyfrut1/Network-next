// pages/api/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict');
  res.status(200).json({ message: 'Logout successful' });
}
