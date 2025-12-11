"use client";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { app_routers } from "./_data/app_routers";
import { usePathname } from "next/navigation";
import { CardTitle } from "../ui/card";
import AppUserDropdown from "./AppUserDropdown";
import AppThemeToggle from "./AppThemeToggle";

function findRouteByPath(pathname: string) {
  for (const route of app_routers) {
    if (route.url === pathname) return route;
    if (route.children) {
      const child = route.children.find((c) => c.url === pathname);
      if (child) return child;
    }
  }
  return null;
}

export default function Navbar() {
  const pathname = usePathname();
  const currentRoute = findRouteByPath(pathname);

  return (
    <nav className="p-2 flex items-center justify-between">
      <div className="flex items-center gap-2 text-lg font-bold">
        <SidebarTrigger />
        <CardTitle className="text-2xl font-bold">
          {currentRoute?.title ?? "Page"}
        </CardTitle>
      </div>
      <div className="flex items-center gap-4">
        <AppThemeToggle />
        <AppUserDropdown />
      </div>
    </nav>
  );
}
