"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Form } from "lucide-react"
import { useMsal } from "@azure/msal-react"


const data = {
  team: 
    {
      name: "TRAMITA",
      logo: (
        <img src="src/assets/Tramita circles dark blue.svg" alt="TRAMITA" className="h-6 w-auto" />
      )
    },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboard
        />
      ),
      isActive: true,
    },
    {
      title: "Formularios de adecuación",
      url: "/formulario",
      icon: (
        <Form
        />
      ),

    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { instance } = useMsal();
  const account = instance.getActiveAccount();

  const user = account ? {
    name: account.name ?? 'Usuario',
    email: account.username,
    avatar: ''
  } : null

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin
      });
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={data.team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} onLogout={handleLogout} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
