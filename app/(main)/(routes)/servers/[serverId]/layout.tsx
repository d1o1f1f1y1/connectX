import ServerSidebar from '@/components/server/server-sidebar';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const user = await currentUser();

  if (!user) {
    return redirect('/');
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  if (!server) {
    return redirect('/setup');
  }

  return (
    <div className="h-full">
      <div
        className="
    hidden 
    md:flex
    h-full
    w-60
    z-20
    flex-col
    inset-y-0
    fixed
    ">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main
        className="
    h-full
    md:pl-60
    ">
        {children}
      </main>
    </div>
  );
};

export default ServerIdLayout;
