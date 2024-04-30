import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server.js';

class ChannelPostHandler {
  async handleRequest(req) {
    try {
      const user = await currentUser();
      const { name, type } = await req.json();
      const { searchParams } = new URL(req.url);

      const serverId = searchParams.get('serverId');

      if (!user?.id) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      if (!serverId) {
        return new NextResponse('Server ID missing', { status: 400 });
      }

      if (name === 'general') {
        return new NextResponse("Name cannot be 'general'", { status: 400 });
      }

      const server = await this.createChannel(user.id, serverId, name, type);

      return NextResponse.json(server);
    } catch (error) {
      console.log('[CHANNELS_POST]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

  async createChannel(userId, serverId, name, type) {
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId: userId,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            userId: userId,
            name: name,
            type: type,
          },
        },
      },
    });

    return server;
  }
}

// Usage
export async function POST(req) {
  const handler = new ChannelPostHandler();
  return handler.handleRequest(req);
}

// export async function POST(req: Request) {
//   try {
//     const user = await currentUser();
//     const { name, type } = await req.json();
//     const { searchParams } = new URL(req.url);

//     const serverId = searchParams.get('serverId');

//     if (!user?.id) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     if (!serverId) {
//       return new NextResponse('Server ID missing', { status: 400 });
//     }

//     if (name === 'general') {
//       return new NextResponse("Name cannot be 'general'", { status: 400 });
//     }

//     const server = await db.server.update({
//       where: {
//         id: serverId,
//         members: {
//           some: {
//             userId: user.id,
//             role: {
//               in: [MemberRole.ADMIN, MemberRole.MODERATOR],
//             },
//           },
//         },
//       },
//       data: {
//         channels: {
//           create: {
//             userId: user.id,
//             name,
//             type,
//           },
//         },
//       },
//     });

//     return NextResponse.json(server);
//   } catch (error: any) {
//     console.log('[CHANNELS_POST]', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }
