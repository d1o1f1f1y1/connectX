import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server.js';

class ServerLeaveHandler {
  async handleRequest(req, { params }) {
    try {
      const user = await currentUser();

      if (!user) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      if (!params.serverId) {
        return new NextResponse('Server ID missing', { status: 400 });
      }

      const server = await this.leaveServer(user.id, params.serverId);

      return NextResponse.json(server);
    } catch (error) {
      console.log('[SERVER_ID_LEAVE]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

  async leaveServer(userId, serverId) {
    const server = await db.server.update({
      where: {
        id: serverId,
        userId: {
          not: userId,
        },
        members: {
          some: {
            userId: userId,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            userId: userId,
          },
        },
      },
    });

    return server;
  }
}

// Usage
export async function PATCH(req, { params }) {
  const handler = new ServerLeaveHandler();
  return handler.handleRequest(req, { params });
}

// import { currentUser } from '@/lib/auth';
// import { db } from '@/lib/db';
// import { NextResponse } from 'next/server.js';

// export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
//   try {
//     const user = await currentUser();

//     if (!user) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     if (!params.serverId) {
//       return new NextResponse('Server ID missing', { status: 400 });
//     }

//     const server = await db.server.update({
//       where: {
//         id: params.serverId,
//         userId: {
//           not: user.id,
//         },
//         members: {
//           some: {
//             userId: user.id,
//           },
//         },
//       },
//       data: {
//         members: {
//           deleteMany: {
//             userId: user.id,
//           },
//         },
//       },
//     });

//     return NextResponse.json(server);
//   } catch (error: any) {
//     console.log('[SERVER_ID_LEAVE', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }
