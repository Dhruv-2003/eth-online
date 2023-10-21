import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const paths = [
  {
    path: "/dashboard",
    label: "Home",
  },
  {
    path: "/chat",
    label: "Chat",
  },
  {
    path: "/rewards",
    label: "Rewards",
  },
  {
    path: "/campaign",
    label: "Campaign",
  },
];

export default function DashboardNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className=" w-screen flex  items-start justify-normal  bg-white  dark:bg-fixed dark:bg-gradient-to-t from-[#070a12] via-[#0c0214] to-[#120131]">
      <aside
        id="sidebar"
        className=" left-0 bottom-0 z-40 h-[92vh] w-72 transition-transform"
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 dark:border-slate-700  dark:bg-fixed dark:bg-gradient-to-t from-[#070a12] via-[#0c0214] to-[#120131]">
          <ul className="space-y-2 text-sm font-medium">
            {paths.map(({ path, label }, index) => (
              <Link
                key={index}
                href={path}
                className={clsx(
                  router.asPath === path &&
                    " dark:bg-[#a7cce629] bg-slate-100 text-black darkbg-indigo-700",
                  "flex items-center rounded-lg px-3 py-2 dark:hover:bg-[#a7cce629] text-slate-900 hover:bg-slate-100 dark:text-white ark:hover:bg-indigo-600"
                )}
              >
                <span className="ml-3 flex-1 whitespace-nowrap">{label}</span>
              </Link>
            ))}
          </ul>
          {/* <div className="mt-auto flex">
            <div className="flex w-full justify-between">
              <span className="text-sm font-medium text-black dark:text-white">
                email@example.com
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                aria-roledescription="more menu"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                className="h-5 w-5 text-black dark:text-white"
                stroke-linecap="round"
                stroke-linejoin="round"
                // className="lucide lucide-more-horizontal"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </div>
          </div> */}
        </div>
      </aside>

      <div className=" px-6 py-4 w-full">{children}</div>
    </div>
  );
}
