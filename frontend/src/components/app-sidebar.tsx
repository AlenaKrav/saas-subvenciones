"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, LayoutDashboard, Form } from "lucide-react"
import { useMsal } from "@azure/msal-react"
// This is sample data.
const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  teams: [
    {
      name: "TRAMITA",
      logo: (
        <img src="src/assets/Tramita circles dark blue.svg" alt="TRAMITA" className="h-6 w-auto" />
      ),
      plan: "Enterprise",
    },
    // {
    //   name: "Acme Corp.",
    //   logo: (
    //     <AudioLinesIcon
    //     />
    //   ),
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: (
    //     <TerminalIcon
    //     />
    //   ),
    //   plan: "Free",
    // },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboard
        />
      ),
      isActive: true,
      // items: [
      //   {
      //     title: "History",
      //     url: "#",
      //   },
      //   {
      //     title: "Starred",
      //     url: "#",
      //   },
      //   {
      //     title: "Settings",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Formularios de adecuación",
      url: "/products",
      icon: (
        <Form
        />
      ),
      // items: [
      //   {
      //     title: "Genesis",
      //     url: "#",
      //   },
      //   {
      //     title: "Explorer",
      //     url: "#",
      //   },
      //   {
      //     title: "Quantum",
      //     url: "#",
      //   },
      // ],
    },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: (
    //     <BookOpenIcon
    //     />
    //   ),
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: (
    //     <Settings2Icon
    //     />
    //   ),
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: (
  //       <FrameIcon
  //       />
  //     ),
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: (
  //       <PieChartIcon
  //       />
  //     ),
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: (
  //       <MapIcon
  //       />
  //     ),
  //   },
  // ],
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
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      {/* Modificar el footer para mostrar info del user */}
      <SidebarFooter>
        {user && <NavUser user={user} onLogout={handleLogout}/>}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
