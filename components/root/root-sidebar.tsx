import ServerHeader from '../server/server-header';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

const RootSidebar = () => {
  return (
    <div
      className="
flex
flex-col
h-full
text-primary
w-full
dark:bg-[#2B2D31]
bg-[#F2F3F5]
">
      <div
        className="
            w-full
            text-4xl
            font-bold
            px-3
            flex
            items-center
            justify-center
            h-20
            border-neutral-200
            dark:border-neutral-800
            border-b-2
            hover:bg-zinc-700/10
            dark:hover:bg-zinc-700/50
            transition
            ">
        connectX
      </div>
      <ScrollArea className="flex-1 px-3">
        {/* <div className="mt-2">
      <ServerSearch
        data={[
          {
            label: 'Text Channels',
            type: 'channel',
            data: textChannels?.map((channel) => ({
              id: channel.id,
              name: channel.name,
              icon: iconMap[channel.type],
            })),
          },
          {
            label: 'Voice Channels',
            type: 'channel',
            data: audioChannels?.map((channel) => ({
              id: channel.id,
              name: channel.name,
              icon: iconMap[channel.type],
            })),
          },
          {
            label: 'Video Channels',
            type: 'channel',
            data: videoChannels?.map((channel) => ({
              id: channel.id,
              name: channel.name,
              icon: iconMap[channel.type],
            })),
          },
          {
            label: 'Members',
            type: 'member',
            data: members?.map((member) => ({
              id: member.id,
              name: member.user.name!,
              icon: roleIconMap[member.role],
            })),
          },
        ]}
      />
    </div> */}
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
      </ScrollArea>
    </div>
  );
};

export default RootSidebar;
