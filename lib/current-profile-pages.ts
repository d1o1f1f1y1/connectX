import { auth } from '@/auth';
import { db } from './db';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIo } from '@/types';


export const currentProfilePages = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  const user = await auth(req, res);

  if (!user) {
    return null;
  }

  const profile = await db.user.findUnique({
    where: {
      id: user.user.id,
    },
  });

  return profile;
};
