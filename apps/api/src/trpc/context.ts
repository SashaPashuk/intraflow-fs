import { prisma } from '@intraflow/db';

export const createContext = () => ({
  prisma,
});

export type Context = ReturnType<typeof createContext>;
