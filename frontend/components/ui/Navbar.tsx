"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./toggle-theme";

export function Navbar() {
  return (
    <div className=" z-50 border-slate-200 border-b bg-[#110e15] dark:border-slate-700 flex items-center justify-between px-12 py-3">
      <Link className=" text-xl tracking-wide font-semibold" href={"/"}>
        OnBoardr
      </Link>
      <div className=" flex items-center justify-normal gap-x-3">
        {/* <NavigationMenu> */}
        {/* <NavigationMenuList> */}
        {/* <NavigationMenuItem> */}
        <Link
          className=" cursor-pointer text-sm"
          href="/get-started"
          legacyBehavior
          passHref
        >
          {/* <NavigationMenuLink className={navigationMenuTriggerStyle()}> */}
          Get Started
          {/* </NavigationMenuLink> */}
        </Link>
        {/* </NavigationMenuItem> */}
        {/* </NavigationMenuList> */}
        {/* </NavigationMenu> */}
        <ModeToggle />
      </div>
    </div>
  );
}
