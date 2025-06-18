'use client';

import { httpBatchLink } from '@trpc/client';
import { trpc } from '../lib/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface TRPCProviderProps {
  children: React.ReactNode;
}

export const TRPCProvider = ({ children }: TRPCProviderProps) => {
  const queryClient = new QueryClient();

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: process.env.NEXT_PUBLIC_TRPC_URL!,
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};