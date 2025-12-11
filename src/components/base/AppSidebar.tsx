"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { app_routers } from "./_data/app_routers";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function AppSidebar() {
  const pathname = usePathname();
  const { status } = useSession();
  const currentUser = useCurrentUser();

  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const permissions = currentUser?.data?.permissions || {};

  // sync submenu state with current path
  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};
    app_routers.forEach((route) => {
      if (route.children) {
        const activeChild = route.children.some((c) => c.url === pathname);
        if (activeChild) {
          newOpenMenus[route.title] = true;
        }
      }
    });
    setOpenMenus(newOpenMenus); // overwrite instead of merging
  }, [pathname]);
  // detect collapse via ResizeObserver
  useEffect(() => {
    const target = sidebarRef.current;
    if (!target || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setIsCollapsed(w < 96);
    });
    ro.observe(target);
    return () => ro.disconnect();
  }, []);
  const handleParentClick = (title: string) => {
    if (isCollapsed) {
      setSidebarOpen(true);
    }
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div ref={sidebarRef}>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {app_routers.map((route: any) => {
                  const hasPermission = route?.permission?.some(
                    (perm: string) => permissions[perm]
                  );
                  if (!hasPermission) return null;

                  const isActive = pathname === route.url;

                  // parent with children
                  if (route.children) {
                    const isOpen = !!openMenus[route.title];

                    const parentButton = (
                      <SidebarMenuButton
                        onClick={() => handleParentClick(route.title)}
                        className={isOpen ? "bg-muted" : ""}
                      >
                        <route.icon className="mr-2 h-4 w-4" />
                        <span className="flex-1 text-sm text-left">
                          {route.title}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </SidebarMenuButton>
                    );

                    return (
                      <SidebarMenuItem key={route.title}>
                        {isCollapsed ? (
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                {parentButton}
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                {route.title}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          parentButton
                        )}

                        {isOpen && (
                          <SidebarMenuSub>
                            {route.children.map((child: any) => {
                              const childPermission = child?.permission?.some(
                                (perm: string) => permissions[perm]
                              );
                              if (!childPermission) return null;

                              const childActive = pathname === child.url;
                              const childItem = (
                                <SidebarMenuSubItem key={child.title}>
                                  <SidebarMenuButton
                                    asChild
                                    isActive={childActive}
                                  >
                                    <Link href={child.url}>
                                      <span>{child.title}</span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuSubItem>
                              );

                              return isCollapsed ? (
                                <TooltipProvider
                                  delayDuration={0}
                                  key={child.title}
                                >
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      {childItem}
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                      {child.title}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                childItem
                              );
                            })}
                          </SidebarMenuSub>
                        )}
                      </SidebarMenuItem>
                    );
                  }

                  // simple route
                  const simpleItem = (
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={route.url}>
                        <route.icon className="mr-2 h-5 w-5" />
                        <span>{route.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  );

                  return (
                    <SidebarMenuItem key={route.title}>
                      {isCollapsed ? (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {simpleItem}
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {route.title}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        simpleItem
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
