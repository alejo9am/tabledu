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
  ClipboardIcon,
  Quiz05Icon,
  PlayCircleIcon,
  LogoutIcon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons"

const dashboardRouteGroups = [
  {
    label: "Content",
    routes: [
      {
        title: "Boards",
        to: "/boards",
        icon: <Icon icon={DashboardSquare02Icon} />,
      },
      {
        title: "Special Tiles",
        to: "/tiles/special",
        icon: <Icon icon={ClipboardIcon} />,
      },
      {
        title: "Question Tiles",
        to: "/tiles/questions",
        icon: <Icon icon={Quiz05Icon} />,
      },
    ],
  },
  {
    label: "Play",
    routes: [
      {
        title: "Game Sessions",
        to: "/games",
        icon: <Icon icon={PlayCircleIcon} />,
      },
    ],
  },
]

function SidebarNavigation() {
  const location = useLocation()

  return (
    <>
      {dashboardRouteGroups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu>
            {group.routes.map((item) => {
              const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <NavLink to={item.to} state={{ from: location.pathname }}>
                      {item.icon}
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
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
  const breadcrumbs = getDashboardBreadcrumbs(pathname)

  if (!breadcrumbs) {
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
                    <Link
                      to={crumb.to}
                      state={{ from: pathname }}
                      aria-label={crumb.title === "Home" ? "Go to Home" : undefined}
                      className={crumb.title === "Home" ? "inline-flex items-center gap-1.5" : undefined}
                    >
                      {crumb.title === "Home" ? (
                        <>
                          <Icon icon={Home01Icon} className="size-4" />
                          <span className="hidden sm:inline">Home</span>
                        </>
                      ) : (
                        crumb.title
                      )}
                    </Link>
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

function getDashboardBreadcrumbs(pathname) {
  if (pathname === "/") {
    return null
  }

  const breadcrumbs = [{ title: "Home", to: "/" }]

  switch (true) {
    case pathname === "/boards":
      breadcrumbs.push({ title: "Boards" })
      break
    case pathname === "/boards/new":
      breadcrumbs.push({ title: "Boards", to: "/boards" })
      breadcrumbs.push({ title: "Create Board" })
      break
    case /^\/boards\/[^/]+$/.test(pathname):
      breadcrumbs.push({ title: "Boards", to: "/boards" })
      breadcrumbs.push({ title: "Board Details" })
      break
    case pathname === "/tiles/special":
      breadcrumbs.push({ title: "Special Tiles" })
      break
    case pathname === "/tiles/questions":
      breadcrumbs.push({ title: "Question Tiles" })
      break
    case pathname === "/games":
      breadcrumbs.push({ title: "Game Sessions" })
      break
    default:
      return null
  }

  if (breadcrumbs.length <= 1) {
    return null
  }

  return breadcrumbs
}

function DashboardLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const showBreadcrumbs = Boolean(getDashboardBreadcrumbs(location.pathname))

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
                <SidebarMenuButton asChild size="lg" className="group-data-[collapsible=icon]:justify-center">
                  <Link to="/" state={{ from: location.pathname }}>
                    <span className="group-data-[collapsible=icon]:hidden">
                      <img src={logoLight} alt="tabledu" className="h-8 w-auto dark:hidden" />
                      <img src={logoDark} alt="tabledu" className="hidden h-8 w-auto dark:block" />
                    </span>
                    <img src="/favicon.svg" alt="tabledu" className="hidden size-6 group-data-[collapsible=icon]:block" />
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
              {showBreadcrumbs ? (
                <>
                  <Separator orientation="vertical" className="mr-3 bg-muted-foreground data-[orientation=vertical]:h-5" />
                  <DashboardBreadcrumb pathname={location.pathname} />
                </>
              ) : null}
            </div>
          </header>
          <Outlet />
        </SidebarInset>

      </TooltipProvider>
    </SidebarProvider>
  )
}

export default DashboardLayout
