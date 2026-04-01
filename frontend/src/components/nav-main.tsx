import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar"

import { SidebarLink } from '@/components/CustomSidebarLink';

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
              <SidebarLink
                to={item.url}
                tooltip={item.title}
                className="flex items-center gap-2"
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarLink>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
