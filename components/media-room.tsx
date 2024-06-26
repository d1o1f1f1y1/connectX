'use client';

import { useEffect, useState } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { Channel } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const user = useCurrentUser();
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!user?.name) return;

    const name = `${user.name} ${user.email !== null ? user.email : ''}`;

    (async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (error: any) {
        console.log(error);
      }
    })();
  }, [chatId, user?.name, user?.email]);

  if (token === '') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2
          className="
        h-7
        w-7
        text-zinc-500
        animate-spin
        my-4
        "
        />
        <p
          className="
        text-sm text-zinc-500 dark:text-zinc-400
        ">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}>
      <VideoConference />
    </LiveKitRoom>
  );
};
