import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server.js';

import { currentUser } from '@/lib/auth';

class ServerPatchHandler {
  async handleRequest(req, { params }) {
    try {
      const user = await currentUser();

      if (!user) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      if (!params.serverId) {
        return new NextResponse('Server ID Missing', { status: 400 });
      }

      const server = await this.updateServerInviteCode(user.id, params.serverId);

      return NextResponse.json(server);
    } catch (error) {
      console.log('[SERVER_ID]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

  async updateServerInviteCode(userId, serverId) {
    const updatedServer = await db.server.update({
      where: {
        id: serverId,
        userId: userId,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return updatedServer;
  }
}

// Usage
export async function PATCH(req, { params }) {
  const handler = new ServerPatchHandler();
  return handler.handleRequest(req, { params });
}

// import { v4 as uuidv4 } from 'uuid';
// import { db } from '@/lib/db';
// import { NextResponse } from 'next/server.js';

// import { currentUser } from '@/lib/auth';

// export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
//   try {
//     const user = await currentUser();

//     if (!user) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     if (!params.serverId) {
//       return new NextResponse('Server ID Missing', { status: 400 });
//     }

//     const server = await db.server.update({
//       where: {
//         id: params.serverId,
//         userId: user.id,
//       },
//       data: {
//         inviteCode: uuidv4(),
//       },
//     });

//     return NextResponse.json(server);
//   } catch (error: any) {
//     console.log('[SERVER_ID]', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }
