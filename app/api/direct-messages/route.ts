import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { DirectMessage } from '@prisma/client';
import { NextResponse } from 'next/server.js';

const MESSAGES_BATCH = 10;

class DirectMessagesGetHandler {
  async handleRequest(req) {
    try {
      const profile = await currentUser();
      const { searchParams } = new URL(req.url);
      const cursor = searchParams.get('cursor');
      const conversationId = searchParams.get('conversationId');

      if (!profile) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      if (!conversationId) {
        return new NextResponse('Conversation ID missing', { status: 400 });
      }

      let messages = [];

      if (cursor) {
        messages = await this.getMessagesWithCursor(conversationId, cursor);
      } else {
        messages = await this.getInitialMessages(conversationId);
      }

      const nextCursor =
        messages.length === MESSAGES_BATCH ? messages[MESSAGES_BATCH - 1].id : null;

      return NextResponse.json({
        items: messages,
        nextCursor,
      });
    } catch (error) {
      console.log('[DIRECT_MESSAGES_GET]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

  async getMessagesWithCursor(conversationId, cursor) {
    const messages = await db.directMessage.findMany({
      take: MESSAGES_BATCH,
      skip: 1,
      cursor: {
        id: cursor,
      },
      where: {
        conversationId,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return messages;
  }

  async getInitialMessages(conversationId) {
    const messages = await db.directMessage.findMany({
      take: MESSAGES_BATCH,
      where: {
        conversationId,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return messages;
  }
}

// Usage
export async function GET(req) {
  const handler = new DirectMessagesGetHandler();
  return handler.handleRequest(req);
}

// import { currentUser } from '@/lib/auth';
// import { db } from '@/lib/db';
// import { DirectMessage } from '@prisma/client';
// import { NextResponse } from 'next/server.js';

// const MESSAGES_BATCH = 10;

// export async function GET(req: Request) {
//   try {
//     const profile = await currentUser();
//     const { searchParams } = new URL(req.url);
//     const cursor = searchParams.get('cursor');
//     const conversationId = searchParams.get('conversationId');

//     if (!profile) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     if (!conversationId) {
//       return new NextResponse('Conversation ID missing', { status: 400 });
//     }

//     let messages: DirectMessage[] = [];

//     if (cursor) {
//       messages = await db.directMessage.findMany({
//         take: MESSAGES_BATCH,
//         skip: 1,
//         cursor: {
//           id: cursor,
//         },
//         where: {
//           conversationId,
//         },
//         include: {
//           member: {
//             include: {
//               user: true,
//             },
//           },
//         },
//         orderBy: {
//           createdAt: 'desc',
//         },
//       });
//     } else {
//       messages = await db.directMessage.findMany({
//         take: MESSAGES_BATCH,
//         where: {
//           conversationId,
//         },
//         include: {
//           member: {
//             include: {
//               user: true,
//             },
//           },
//         },
//         orderBy: {
//           createdAt: 'desc',
//         },
//       });
//     }

//     let nextCursor = null;

//     if (messages.length === MESSAGES_BATCH) {
//       nextCursor = messages[MESSAGES_BATCH - 1].id;
//     }

//     return NextResponse.json({
//       items: messages,
//       nextCursor,
//     });
//   } catch (error: any) {
//     console.log('[DIRECT_MESSAGES_GET]', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }
