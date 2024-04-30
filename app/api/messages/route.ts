import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';

const MESSAGES_BATCH = 10;

class MessageGetHandler {
  async handleRequest(req) {
    try {
      const user = await currentUser();
      const { searchParams } = new URL(req.url);
      const cursor = searchParams.get('cursor');
      const channelId = searchParams.get('channelId');

      if (!user) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      if (!channelId) {
        return new NextResponse('Channel ID missing', { status: 400 });
      }

      let messages = [];

      if (cursor) {
        messages = await this.getMessagesWithCursor(channelId, cursor);
      } else {
        messages = await this.getInitialMessages(channelId);
      }

      const nextCursor =
        messages.length === MESSAGES_BATCH ? messages[MESSAGES_BATCH - 1].id : null;

      return NextResponse.json({
        items: messages,
        nextCursor,
      });
    } catch (error) {
      console.log('[MESSAGES_GET]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

  async getMessagesWithCursor(channelId, cursor) {
    const messages = await db.message.findMany({
      take: MESSAGES_BATCH,
      skip: 1,
      cursor: {
        id: cursor,
      },
      where: {
        channelId,
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

  async getInitialMessages(channelId) {
    const messages = await db.message.findMany({
      take: MESSAGES_BATCH,
      where: {
        channelId,
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
  const handler = new MessageGetHandler();
  return handler.handleRequest(req);
}

// import { currentUser } from '@/lib/auth';
// import { db } from '@/lib/db';
// import { Message } from '@prisma/client';
// import { NextResponse } from 'next/server';

// const MESSAGES_BATCH = 10;

// export async function GET(req: Request) {
//   try {
//     const user = await currentUser();
//     const { searchParams } = new URL(req.url);
//     const cursor = searchParams.get('cursor');
//     const channelId = searchParams.get('channelId');

//     if (!user) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     if (!channelId) {
//       return new NextResponse('Channel ID missing', { status: 400 });
//     }

//     let messages: Message[] = [];

//     if (cursor) {
//       messages = await db.message.findMany({
//         take: MESSAGES_BATCH,
//         skip: 1,
//         cursor: {
//           id: cursor,
//         },
//         where: {
//           channelId,
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
//       messages = await db.message.findMany({
//         take: MESSAGES_BATCH,
//         where: {
//           channelId,
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
//     console.log('[MESSAGES_GET]', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }
