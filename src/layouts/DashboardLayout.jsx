import { Fragment } from "react"
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { Icon } from "@/components/ui/Icon"
import logoDark from "@/assets/logo-dark.svg"
import logoLight from "@/assets/logo-light.svg"
import {
  Home01Icon,
  DashboardSquare02Icon,
  Quiz05Icon,
  ClipboardIcon,
  PlayCircleIcon,
  LogoutIcon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons"

const dashboardRoutes = [
  {
    title: "Home",
    to: "/",
    icon: <Icon icon={Home01Icon}/>,
  },
  {
    title: "Boards",
    to: "/boards",
    icon: <Icon icon={DashboardSquare02Icon} />,
  },
  {
    title: "Questions",
    to: "/questions",
    icon: <Icon icon={Quiz05Icon} />,
  },
  {
    title: "Categories",
    to: "/categories",
    icon: <Icon icon={ClipboardIcon} />,
  },
  {
    title: "Game Sessions",
    to: "/games",
    icon: <Icon icon={PlayCircleIcon} />, 
  },
]

function SidebarNavigation() {
  const location = useLocation()

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
      <SidebarMenu>
        {dashboardRoutes.map((item) => {
          const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.title}
              >
                <NavLink to={item.to} state={{ from: location.pathname }} end={item.to === "/"}>
                  {item.icon}
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function SidebarUserMenu({ user }) {
  const { isMobile } = useSidebar()
  const { signOut } = useAuth()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <Icon icon={UnfoldMoreIcon} className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <Icon icon={LogoutIcon} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function DashboardBreadcrumb({ pathname }) {
  const breadcrumbs = [{ title: "Home", to: "/" }]

  if (pathname === "/") {
    return null
  }

  if (pathname.startsWith("/boards")) {
    breadcrumbs.push({ title: "Boards", to: "/boards" })

    if (pathname === "/boards/new") {
      breadcrumbs.push({ title: "Create Board" })
      // Keep details breadcrumb only for /boards/:boardId, not the /boards index route.
    } else if (/^\/boards\/[^/]+$/.test(pathname)) {
      breadcrumbs.push({ title: "Board Details" })
    }
  } else {
    const currentRoute = dashboardRoutes.find((route) => route.to === pathname)

    if (!currentRoute) {
      return null
    }

    breadcrumbs.push({ title: currentRoute.title })
  }

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <Fragment key={`${crumb.title}-${index}`}>
              <BreadcrumbItem>
                {isLast || !crumb.to ? (
                  <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.to} state={{ from: pathname }}>{crumb.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast ? <BreadcrumbSeparator /> : null}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function DashboardLayout() {
  const { user } = useAuth()
  const location = useLocation()

  const userData = user
    ? {
      name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      email: user.email || "",
      avatar: user.user_metadata?.avatar_url || "",
    }
    : {
      name: "Guest",
      email: "",
      avatar: "",
    }

  return (
    <SidebarProvider>
      <TooltipProvider>
        <Sidebar collapsible="icon">

          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg">
                  <Link to="/" state={{ from: location.pathname }}>
                    <img src={logoLight} alt="tabledu" className="h-8 w-auto dark:hidden" />
                    <img src={logoDark} alt="tabledu" className="hidden h-8 w-auto dark:block" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarNavigation />
          </SidebarContent>

          <SidebarFooter>
            <SidebarUserMenu user={userData} />
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <DashboardBreadcrumb pathname={location.pathname} />
            </div>
          </header>
          <Outlet />
        </SidebarInset>

      </TooltipProvider>
    </SidebarProvider>
  )
}

export default DashboardLayout
