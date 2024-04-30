import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server.js';

class ServerDeleteHandler {
  async handleRequest(req, { params }) {
    try {
      const user = await currentUser();

      if (!user) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      const server = await this.deleteServer(params.serverId, user.id);

      return NextResponse.json(server);
    } catch (error) {
      console.log('[SERVER_ID_DELETE]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

  async deleteServer(serverId, userId) {
    const server = await db.server.delete({
      where: {
        id: serverId,
        userId: userId,
      },
    });

    return server;
  }
}

class ServerPatchHandler {
  async handleRequest(req, { params }) {
    try {
      const user = await currentUser();
      const { name, imageUrl } = await req.json();

      if (!user) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      const server = await this.updateServer(params.serverId, user.id, name, imageUrl);

      return NextResponse.json(server);
    } catch (error) {
      console.log('[SERVER_ID_PATCH]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

  async updateServer(serverId, userId, name, imageUrl) {
    const server = await db.server.update({
      where: {
        id: serverId,
        userId: userId,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return server;
  }
}

// Usage
export async function DELETE(req, { params }) {
  const deleteHandler = new ServerDeleteHandler();
  return deleteHandler.handleRequest(req, { params });
}

export async function PATCH(req, { params }) {
  const patchHandler = new ServerPatchHandler();
  return patchHandler.handleRequest(req, { params });
}

// import { currentUser } from '@/lib/auth';
// import { db } from '@/lib/db';
// import { NextResponse } from 'next/server.js';

// export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
//   try {
//     const user = await currentUser();

//     if (!user) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     const server = await db.server.delete({
//       where: {
//         id: params.serverId,
//         userId: user.id,
//       },
//     });

//     return NextResponse.json(server);
//   } catch (error: any) {
//     console.log('[SERVER_ID_DELETE]', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }

// export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
//   try {
//     const user = await currentUser();
//     const { name, imageUrl } = await req.json();

//     if (!user) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     const server = await db.server.update({
//       where: {
//         id: params.serverId,
//         userId: user.id,
//       },
//       data: {
//         name,
//         imageUrl,
//       },
//     });

//     return NextResponse.json(server);
//   } catch (error: any) {
//     console.log('[SERVER_ID_PATCH]', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }
