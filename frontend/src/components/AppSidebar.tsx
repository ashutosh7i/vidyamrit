// manage role based ui from here
// manage open assessments from here

"use client";

import { useEffect, useState } from "react";

import {
  LogOut,
  User,
  EllipsisVertical,
  Info,
  UserStar,
  School,
  UserPen,
  GraduationCap,
} from "lucide-react";
import { SidebarItems } from "@/components/SidebarItems";
import { OpenAssessments } from "@/components/OpenAssessments";
import { SchoolSwitcher } from "@/components/SchoolSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { LanguageToggleButton } from "./LanguageToggleButton";
import { getCurrentUser, logout } from "@/services/auth";
import { AUTH_ROUTE_PATHS, DASHBOARD_ROUTE_PATHS } from "@/routes";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Super Admin",
      url: "#",
      icon: UserStar,
      items: [
        {
          title: "Manage Schools",
          url: DASHBOARD_ROUTE_PATHS.schools,
        },
        {
          title: "Manage School Admins",
          url: DASHBOARD_ROUTE_PATHS.schoolAdmin,
        },
      ],
    },
    {
      title: "School Admin",
      url: "#",
      icon: School,
      items: [
        {
          title: "Manage Mentors",
          url: DASHBOARD_ROUTE_PATHS.mentors,
        },
        {
          title: "Manage Students",
          url: DASHBOARD_ROUTE_PATHS.students,
        },
        {
          title: "Manage Cohorts",
          url: DASHBOARD_ROUTE_PATHS.cohorts,
        },
      ],
    },
    {
      title: "Mentor",
      url: "#",
      icon: UserPen,
      items: [
        {
          title: "Baseline Assessments Page",
          url: DASHBOARD_ROUTE_PATHS.baselineAssessments,
        },
        {
          title: "Student Reports",
          url: DASHBOARD_ROUTE_PATHS.studentReports,
        },
      ],
    },
    {
      title: "Students",
      url: DASHBOARD_ROUTE_PATHS.studentReports,
      icon: GraduationCap,
    },
  ],
  openAssessments: [
    {
      name: "assessment001",
      assessment_id: "1234",
    },
    {
      name: "assessment002",
      assessment_id: "5678",
    },
    {
      name: "assessment003",
      assessment_id: "91011",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const { isMobile } = useSidebar();

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = AUTH_ROUTE_PATHS.logout;
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SchoolSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarItems items={data.navMain} />
        <OpenAssessments openAssessments={data.openAssessments} />
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <User />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
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
                  <User />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User />
                {t("Account")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Info />
                {t("Notifications")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LanguageToggleButton />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 flex items-center gap-2 text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {t("Logout")}
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
