//General dashboard layout

import { createFileRoute, Outlet, Navigate, Link } from '@tanstack/react-router';
import { useIsAuthenticated } from '@azure/msal-react';
import { useMsal } from "@azure/msal-react";
import { requireAuth } from '../../auth/routeGuards';
import LoadingScreen from '../../components/LoadingScreen';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';




export const Route = createFileRoute('/_app')({
  component: DashboardLayout,
  beforeLoad: ({ context }) => {
    requireAuth(context);
  },
})

function DashboardLayout() {
  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  if (inProgress !== 'none') {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <TooltipProvider>
      <SidebarProvider>
        {/* Imports appsidebar component */}
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Formularios</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Tooltip>
              <TooltipTrigger>
                            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
              </TooltipTrigger>
              <TooltipContent>
                Cambiar tema
              </TooltipContent>
            </Tooltip>

          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
              {/* TO DO: hacer que sea un componente aparte */}
              <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
              <Link to="/products">
                <Button
                  className="w-auto mt-2"
                  variant="primary"
                  size="xl"
                  disabled={inProgress !== 'none'}>Ir a productos</Button>
                  </Link>
              </div>
              <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
              <Link to="/formulario">
                            <Button
                  className="w-auto mt-2"
                  variant="primary"
                  size="xl"
                  disabled={inProgress !== 'none'}>Ir a formulario</Button>
                  </Link>
              </div>
              

              
              {/* <div className="aspect-video rounded-xl bg-muted/50" /> */}
            </div>
            {/* Our custom Dashboard component */}
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}