'use client';

import Image from 'next/image';
import { Separator } from '../ui/separator';
import { PiGenderMale, PiGenderFemale } from 'react-icons/pi';
import { FaUserSecret } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { MdModeEditOutline } from 'react-icons/md';
import { IconType } from 'react-icons/lib';
import { IoChatboxEllipses } from 'react-icons/io5';
import { Gender, User } from '@prisma/client';
import { cn } from '@/lib/utils';

const ProfilePopover = ({ user }: { user: User }) => {
  const text = user.description || '';

  const createdAtDate = new Date(user.createdAt);

  const colors: { MALE: string; FEMALE: string; SECRET: string } = {
    MALE: '#6366F1',
    FEMALE: '#FF0FF0',
    SECRET: '#059669',
  };

  const icons: { MALE: IconType; FEMALE: IconType; SECRET: IconType } = {
    MALE: PiGenderMale,
    FEMALE: PiGenderFemale,
    SECRET: FaUserSecret,
  };

  const color = colors[user.gender];
  const Icon = icons[user.gender];

  const shortenedText = text.length > 100 ? text.substring(0, 100) + '...' : text;

  return (
    <div className={`relative w-[300px] h-[400px]  p-2 md:p-4`}>
      <div className={`absolute top-5 right-5 z-20 flex gap-3 `}>
        <MdModeEditOutline className="w-5 h-5 cursor-pointer hover:opacity-75" />
        <BsThreeDots className="w-5 h-5 cursor-pointer hover:opacity-75" />
      </div>
      <div className="w-[300px] h-[125px] absolute top-0 left-0 z-10">
        <Image
          src={
            user?.bannerImage ||
            'https://i.pinimg.com/564x/b0/a8/1d/b0a81dd69bb47b07a707b801b3fbe6a0.jpg'
          }
          alt="profile banner"
          fill
        />
      </div>
      <div className=" flex flex-col items-center justify-center pt-[35px]">
        <Image
          className="z-20 rounded-full  hover:opacity-75 cursor-pointer"
          src={user?.image!}
          alt="profile avatar"
          width={100}
          height={100}
        />
      </div>
      <div className="mt-[15px] bg-[#111214] w-full h-[220px] p-4">
        <div className="flex items-center justify-between">
          <h1
            className={cn(`font-semibold text-lg flex items-center gap-2 `, {
              'text-[#6366F1]': user.gender === Gender.MALE,
              'text-[#FF0FF0]': user.gender === Gender.FEMALE,
              'text-[#059669]': user.gender === Gender.SECRET,
            })}>
            {user.name} <Icon className="h-6 w-6" />
          </h1>
          <IoChatboxEllipses className={`w-8 h-8 cursor-pointer hover:opacity-75`} />
        </div>
        <Separator className="my-[5px] bg-[#2E2F34] h-[2px]" />
        <p className="text-[12px] ">
          <span className={`text-[${color}]`}>email:</span>
          <br />
          {user.email}
        </p>
        <p className="text-[12px]">
          <span className={`text-[${color}]`}>desc:</span>
          <br />
          {shortenedText}
        </p>
        <Separator className="my-[5px] bg-[#2E2F34] h-[2px]" />

        <p className="text-[10px]">
          <span className={`text-[${color}]`}> joined connectX:</span>
          <br /> {createdAtDate.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ProfilePopover;
