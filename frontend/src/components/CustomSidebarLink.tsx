import { createLink } from "@tanstack/react-router";
import type { LinkComponent } from "@tanstack/react-router";
import { SidebarMenuButton } from "./ui/sidebar";
import type { ComponentProps } from "react";

type SidebarMenuButtonProps = ComponentProps<typeof SidebarMenuButton>

const CustomSidebarLink = (props: SidebarMenuButtonProps) => (
    <SidebarMenuButton {...props} />
);

const TanStackSidebarLink = createLink(CustomSidebarLink);

export const SidebarLink: LinkComponent<typeof TanStackSidebarLink> = (props) => {
    return (
        <TanStackSidebarLink
            preload="intent"
            activeProps={{
                className: "bg-sidebar-accent text-sidebar-accent-foreground",
            }}
            {...props} />
    )
}