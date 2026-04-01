import { createLink } from "@tanstack/react-router";
import type { LinkComponent } from "@tanstack/react-router";
import { SidebarMenuButton } from "./ui/sidebar";
import type { ComponentProps } from "react";

type SidebarMenuButtonProps = ComponentProps<typeof SidebarMenuButton>


// Basic styles of our custom Sidebarbutton Component
const CustomSidebarLink = (props: SidebarMenuButtonProps) => (
    <SidebarMenuButton {...props} />
)

// Transform CustomSidebarLink into Router Link, now it will automatucally have props (to, params, search, activeProps, preload)
// Now CustomSidebarLink will have Link behaviour
const TanStackSidebarLink = createLink(CustomSidebarLink);

// Typing SidebarLink
export const SidebarLink: LinkComponent<typeof TanStackSidebarLink> = (props) => {
    return (
        <TanStackSidebarLink
        // preloads the page when hover
            preload="intent"
            // If actual route === to activeProps are enabled
            activeProps={{
                className: "bg-sidebar-accent text-sidebar-accent-foreground",
            }}
            //allows us to use "to='/dashboard'
            {...props} />
    )
}