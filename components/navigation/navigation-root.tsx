'use client';

import { IoPlanetSharp } from 'react-icons/io5';
import { ActionTooltip } from '../action-tooltip';
import Link from 'next/link';

const NavigationRoot = () => {
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Go to a root">
        <Link href="/root" className="group items-center">
          <div
            className="
        flex
        mx-3
        h-[48px]
        w-[48px]
        rounded-[24px]
        group-hover:rounded-[16px]
        transition-all
        overflow-hidden
        items-center
        justify-center
        bg-background 
        dark:bg-neutral-700
        group-hover:bg-emerald-500

        ">
            <IoPlanetSharp
              className="
            group-hover:text-white
            transition
            text-emerald-500
            "
              size={25}
            />
          </div>
        </Link>
      </ActionTooltip>
    </div>
  );
};

export default NavigationRoot;
