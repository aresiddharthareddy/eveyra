"use client";

import { LeftSidebar } from "@/components/layout/left-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { SearchModal } from "@/components/search/search-modal";

export function AppShell({
  children,
  repositories,
  rightSidebar,
}: {
  children: React.ReactNode;
  repositories?: { id: string; name: string; slug: string; ownerUsername: string }[];
  rightSidebar?: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <LeftSidebar repositories={repositories} />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto">{children}</main>
          {rightSidebar}
        </div>
      </div>
      <SearchModal />
    </div>
  );
}

export { RightSidebar };
