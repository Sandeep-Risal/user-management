"use client";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "../../../ui/sidebar";
import { AppSidebar } from "..";
import { QueryClient, QueryClientProvider } from "react-query";

const SidebarLayout = ({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
        cacheTime: 0,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex w-full">
          <AppSidebar />
          <main className="flex-1 shrink-0">
            <SidebarTrigger />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export default SidebarLayout;
