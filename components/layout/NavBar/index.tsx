import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LuEdit, LuLightbulb } from "react-icons/lu";

import { Popover } from "@headlessui/react";
import Link from "next/link";

const NavBar = () => {
  return (
    <div className="relative z-50">
      <div className="min-[515px]:w-min-[85px] min-[515px]:w-max-[85px] bottom-0 flex h-[85px] w-screen items-center justify-center bg-white shadow-xl max-[515px]:fixed  max-[515px]:right-0 min-[515px]:left-0 min-[515px]:top-0  min-[515px]:h-screen  min-[515px]:w-[85px] min-[515px]:flex-col min-[515px]:pt-7">
        <div className="flex w-1/4 min-w-max items-center justify-center min-[515px]:w-full min-[515px]:flex-col ">
          <Link href={"/"} className="min-[515px]:mb-5 mt-1">
            <Image
              className="scale-95"
              src="/images/VulseLogo.svg"
              alt="Vulse Logo Full"
              width={57}
              height={57}
            />
          </Link>
        </div>

        <div className="flex w-1/2 items-center max-[515px]:h-full min-[515px]:w-full min-[515px]:flex-col min-[515px]:justify-start">
          <div className="flex h-[85px] w-full flex-col items-center justify-center transition hover:bg-vulseBlue hover:bg-opacity-10">
            <div className="absolute left-0 hidden h-full w-[5px] bg-white transition active:flex" />
            {/* this is a test - which will be implemented when on the current page */}
            <a
              href=""
              className="flex w-full cursor-pointer flex-col items-center justify-center text-xs text-vulse-white"
            >
              <div className="">
                <Image
                  className="h-full w-full"
                  src="/images/DashboardNav.svg"
                  alt="Dashboard"
                  width={50}
                  height={50}
                />
              </div>
            </a>
          </div>

          <div className="flex h-[85px] w-full flex-col items-center justify-center transition hover:bg-vulseBlue hover:bg-opacity-10 max-[515px]:hidden ">
            <div className="absolute left-0 hidden h-full w-[5px] bg-white transition active:flex" />
            {/* this is a test - which will be implemented when on the current page */}
            <Link
              href="/schedule"
              className="flex w-full cursor-pointer flex-col items-center justify-center text-xs text-vulse-white"
            >
              <div className="">
                <Image
                  className="h-full w-full"
                  src="/images/schedule.svg"
                  alt="Schedule"
                  width={50}
                  height={50}
                />
              </div>
            </Link>
          </div>

          <div className="flex h-[85px] w-full flex-col items-center justify-center transition hover:bg-slate-500 bg-vulsePurple bg-opacity-100 max-[515px]:hidden ">
            <div className="absolute left-0 hidden h-full w-[5px] bg-white transition active:flex" />
            {/* this is a test - which will be implemented when on the current page */}
            <Link
              href="/post-creation"
              className="flex w-full cursor-pointer flex-col items-center justify-center text-xs text-vulse-white"
            >
              <div className="">
                <Image
                  className="h-full w-full "
                  src="/images/postCreation.svg"
                  alt="Dashboard"
                  width={50}
                  height={50}
                />
              </div>
            </Link>
          </div>

          <div className="flex h-[85px] w-full flex-col items-center justify-center transition bg-vulsePurple hover:bg-slate-500 bg-opacity-100 max-[515px]:hidden ">
            <div className="absolute left-0 hidden h-full w-[5px] bg-white transition active:flex" />
            {/* this is a test - which will be implemented when on the current page */}
            <Link
              href="/content-ideas"
              className="flex w-full cursor-pointer flex-col items-center justify-center text-xs text-vulse-white   "
            >
              <div className="">
                <label className="flex-col justify-center items-center w-full h-full text-white">
                  <LuLightbulb
                    className="stroke-white mb-1.5 font-medium text-[11px] font-kumbh w-full"
                    size={26}
                  />
                  <div className="text-[11px]">Content Ideas</div>
                </label>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex h-full w-1/4 flex-col items-center justify-end min-[515px]:w-full">
          <Popover className="relative flex h-[85px] w-full flex-col items-center justify-center transition hover:bg-vulseBlue hover:bg-opacity-10">
            <div className="absolute left-0 hidden h-full w-[5px] bg-white transition active:flex" />
            {/* this is a test - which will be implemented when on the current page */}
            <Popover.Button className={"outline-none"}>
              <a
                href=""
                className="flex w-full flex-col items-center justify-center"
              >
                <div className="h-[36.91px] w-[36.91px] overflow-hidden rounded-full border-2 border-vulsePurple border-opacity-40  bg-white "></div>
              </a>
            </Popover.Button>
          </Popover>
          <div className="group/item relative flex h-[85px] w-full flex-col items-center justify-center transition hover:bg-vulseBlue hover:bg-opacity-10">
            <div className="absolute left-0 hidden h-full w-[5px] bg-white transition active:flex" />
            {/* this is a test - which will be implemented when on the current page */}

            <Link
              href="/settings"
              className="flex w-full cursor-pointer flex-col items-center justify-center text-xs text-vulseBlue"
            >
              <Image
                className="scale-[85%]"
                src="/images/setting.svg"
                alt="Setting"
                width={50}
                height={50}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
