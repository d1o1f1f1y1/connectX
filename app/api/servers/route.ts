import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server.js';
import { MemberRole } from '@prisma/client';
import { currentUser } from '@/lib/auth';

class ServerCreateHandler {
  async handleRequest(req) {
    try {
      const { name, imageUrl } = await req.json();
      const user = await currentUser();

      if (!user?.id) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      const server = await this.createServer(user.id, name, imageUrl);

      return NextResponse.json(server);
    } catch (error) {
      console.log('[SERVERS_POST]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

  async createServer(userId, name, imageUrl) {
    const server = await db.server.create({
      data: {
        userId: userId,
        name: name,
        imageUrl: imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: 'general', userId: userId }],
        },
        members: {
          create: [{ userId: userId, role: MemberRole.ADMIN }],
        },
      },
    });

    return server;
  }
}

// Usage
export async function POST(req) {
  const handler = new ServerCreateHandler();
  return handler.handleRequest(req);
}

// import { v4 as uuidv4 } from 'uuid';
// import { db } from '@/lib/db';
// import { NextResponse } from 'next/server.js';

// import { MemberRole } from '@prisma/client';
// import { currentUser } from '@/lib/auth';

// export async function POST(req: Request) {
//   try {
//     const { name, imageUrl } = await req.json();

//     const user = await currentUser();

//     if (!user?.id) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     const server = await db.server.create({
//       data: {
//         userId: user.id,
//         name,
//         imageUrl,
//         inviteCode: uuidv4(),
//         channels: {
//           create: [{ name: 'general', userId: user.id }],
//         },
//         members: {
//           create: [{ userId: user.id, role: MemberRole.ADMIN }],
//         },
//       },
//     });

//     return NextResponse.json(server);
//   } catch (error) {
//     console.log('[SERVERS_POST]', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }
