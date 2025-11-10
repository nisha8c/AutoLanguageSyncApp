import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/src/trpc/router'; // adjust path if needed

// 1️⃣ React hook client (for useQuery, useMutation, etc.)
export const trpc = createTRPCReact<AppRouter>();

// 2️⃣ Plain client (for manual .query() or .mutation() calls)
export const trpcClient = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:4000/trpc',
        }),
    ],
});
