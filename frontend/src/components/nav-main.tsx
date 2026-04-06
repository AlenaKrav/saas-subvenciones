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

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Panel de administración</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
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
