"use client";

import { Toaster } from "@/src/shared/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "react-query";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <Toaster richColors closeButton position="top-center" />
      <div className="flex flex-col items-center justify-center h-screen">
        {children}
      </div>
    </QueryClientProvider>
  );
}
