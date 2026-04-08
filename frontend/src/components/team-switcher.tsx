"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useTheme } from "@/components/theme-provider"

export function TeamSwitcher({
  team,
}: {
  team: {
    name: string
    logoLight: React.ReactNode
    logoDark: React.ReactNode
  }
}) {

  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                {isDark ? team.logoDark : team.logoLight}
              </div>
              <div className="grid flex-1 text-left text-2xl leading-tight">
                <span className="font-semibold text-sm sm:text-base md:text-2xl">{team.name}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
