// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { console } from 'inspector';

const API_URL = process.env.NEXT_PUBLIC_BACK_API_URL as string;


export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token } = response.data.data;

    // Зберігаємо токен у HTTP-only cookie для безпечного доступу

    res.setHeader('Set-Cookie', `token=${token}; Path=/; SameSite=Lax`);
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: 'Invalid email or password' });
  }
}
