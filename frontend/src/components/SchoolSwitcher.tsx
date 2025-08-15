"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// Example school logos (replace with your own SVG/icon components)
const SchoolLogoA = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 16 16" fill="currentColor">
    <circle cx="8" cy="8" r="7" />
  </svg>
);
const SchoolLogoB = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 16 16" fill="currentColor">
    <rect x="3" y="3" width="10" height="10" rx="2" />
  </svg>
);
const SchoolLogoC = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 16 16" fill="currentColor">
    <polygon points="8,2 14,14 2,14" />
  </svg>
);

const defaultSchools = [
  {
    name: "Green Valley School",
    logo: SchoolLogoA,
    type: "Public",
  },
  {
    name: "Sunrise Academy",
    logo: SchoolLogoB,
    type: "Private",
  },
  {
    name: "Riverdale High",
    logo: SchoolLogoC,
    type: "Charter",
  },
];

export function SchoolSwitcher({
  schools = defaultSchools,
}: {
  schools?: {
    name: string;
    logo: React.ElementType;
    type: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeSchool, setActiveSchool] = React.useState(schools[0]);

  if (!activeSchool) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeSchool.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeSchool.name}</span>
                <span className="truncate text-xs">{activeSchool.type}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Schools
            </DropdownMenuLabel>
            {schools.map((school, index) => (
              <DropdownMenuItem
                key={school.name}
                onClick={() => setActiveSchool(school)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <school.logo className="size-3.5 shrink-0" />
                </div>
                {school.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add school</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
