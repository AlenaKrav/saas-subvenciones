import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

import { Link } from '@tanstack/react-router'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
  }[]
}) {
  const currentPath = window.location.pathname
  console.log(currentPath)
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Panel de administración</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = currentPath.startsWith(item.url)
          console.log(isActive)

          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                className={isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                tooltip={item.title}
              >
                <Link to={item.url} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
