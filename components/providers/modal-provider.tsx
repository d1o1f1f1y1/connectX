'use client';

import CreateServerModal from '@/components/modals/create-server-modal';
import { useEffect, useState } from 'react';
import InviteModal from '@/components/modals/invite-modal';
import EditServerModal from '../modals/edit-server-modal';
import MembersModal from '../modals/members-modal';
import CreateChannelModal from '../modals/create-channel-modal';
import LeaveServerModal from '../modals/leave-server-modal';
import DeleteServerModal from '../modals/delete-server-modal';
import DeleteChannelModal from '../modals/delete-channel-modal';
import EditChannelModal from '../modals/edit-channel-modal';
import MessageFileModal from '../modals/message-file-modal';
import DeleteMessageModal from '../modals/delete-message-modal';
import SettingsModal from '../modals/settings-modal';
import ProfileModal from '../modals/profile-modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
      <SettingsModal />
      <ProfileModal />
    </>
  );
};