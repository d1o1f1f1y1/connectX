'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { FaUser } from 'react-icons/fa';
import { useCurrentUser } from '@/hooks/use-current-user';
import LogoutButton from './logout-button';
import { ExitIcon } from '@radix-ui/react-icons';
import { RxGear, RxPerson } from 'react-icons/rx';
import { useModal } from '@/hooks/use-modal-store';

export const UserButton = () => {
  const user = useCurrentUser();
  const { onOpen } = useModal();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ''} />
          <AvatarFallback className="bg-[#404040]">
            <FaUser className="text-[#1A9F73]" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem onClick={() => onOpen('profile')}>
          <RxPerson className="h-4 w-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpen('settings')}>
          <RxGear className="h-4 w-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem>
            <ExitIcon className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
