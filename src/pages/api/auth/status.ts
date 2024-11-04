import type { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let isAuthenticated = false;
    const token = req.cookies.token;

    if (token) {
        try {
            await jwtVerify(
                token,
                new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!)
            );
            isAuthenticated = true;
        } catch  {
            isAuthenticated = false;
        }
    }

    res.status(200).json({ isAuthenticated });
}