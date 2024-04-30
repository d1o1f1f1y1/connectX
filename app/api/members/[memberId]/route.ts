import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server.js';

class MemberDeleteHandler {
  async handleRequest(req, { params }) {
    try {
      const user = await currentUser();
      const { searchParams } = new URL(req.url);

      const serverId = searchParams.get('serverId');

      if (!user) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      if (!serverId) {
        return new NextResponse('Server ID missing', { status: 400 });
      }

      if (!params.memberId) {
        return new NextResponse('Member ID missing', { status: 400 });
      }

      const server = await this.deleteMember(serverId, user.id, params.memberId);

      return NextResponse.json(server);
    } catch (error) {
      console.log('[MEMBER_ID_DELETE]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

  async deleteMember(serverId, userId, memberId) {
    const server = await db.server.update({
      where: {
        id: serverId,
        userId: userId,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            userId: {
              not: userId,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return server;
  }
}

class MemberPatchHandler {
  async handleRequest(req, { params }) {
    try {
      const user = await currentUser();
      const { searchParams } = new URL(req.url);
      const { role } = await req.json();

      const serverId = searchParams.get('serverId');

      if (!user) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      if (!serverId) {
        return new NextResponse('Server ID missing', { status: 400 });
      }

      if (!params.memberId) {
        return new NextResponse('Member ID missing', { status: 400 });
      }

      const server = await this.updateMemberRole(serverId, user.id, params.memberId, role);

      return NextResponse.json(server);
    } catch (error) {
      console.log('[MEMBERS_ID_PATCH]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

  async updateMemberRole(serverId, userId, memberId, role) {
    const server = await db.server.update({
      where: {
        id: serverId,
        userId: userId,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              userId: {
                not: userId,
              },
            },
            data: {
              role: role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return server;
  }
}

// Usage
export async function DELETE(req, { params }) {
  const handler = new MemberDeleteHandler();
  return handler.handleRequest(req, { params });
}

export async function PATCH(req, { params }) {
  const handler = new MemberPatchHandler();
  return handler.handleRequest(req, { params });
}

// import { currentUser } from '@/lib/auth';
// import { db } from '@/lib/db';
// import { NextResponse } from 'next/server.js';

// export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
//   try {
//     const user = await currentUser();
//     const { searchParams } = new URL(req.url);

//     const serverId = searchParams.get('serverId');

//     if (!user) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     if (!serverId) {
//       return new NextResponse('Server ID missing', { status: 400 });
//     }

//     if (!params.memberId) {
//       return new NextResponse('Member ID missing', { status: 400 });
//     }

//     const server = await db.server.update({
//       where: {
//         id: serverId,
//         userId: user.id,
//       },
//       data: {
//         members: {
//           deleteMany: {
//             id: params.memberId,
//             userId: {
//               not: user.id,
//             },
//           },
//         },
//       },
//       include: {
//         members: {
//           include: {
//             user: true,
//           },
//           orderBy: {
//             role: 'asc',
//           },
//         },
//       },
//     });

//     return NextResponse.json(server);
//   } catch (error: any) {
//     console.log('[MEMBER_ID_DELETE]', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }

// export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
//   try {
//     const user = await currentUser();
//     const { searchParams } = new URL(req.url);
//     const { role } = await req.json();

//     const serverId = searchParams.get('serverId');

//     if (!user) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     if (!serverId) {
//       return new NextResponse('Server ID missing', { status: 400 });
//     }

//     if (!params.memberId) {
//       return new NextResponse('Member ID missing', { status: 400 });
//     }

//     const server = await db.server.update({
//       where: {
//         id: serverId,
//         userId: user.id,
//       },
//       data: {
//         members: {
//           update: {
//             where: {
//               id: params.memberId,
//               userId: {
//                 not: user.id,
//               },
//             },
//             data: {
//               role,
//             },
//           },
//         },
//       },
//       include: {
//         members: {
//           include: {
//             user: true,
//           },
//           orderBy: {
//             role: 'asc',
//           },
//         },
//       },
//     });

//     return NextResponse.json(server);
//   } catch (error: any) {
//     console.log('[MEMBERS_ID_PATCH]', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }
