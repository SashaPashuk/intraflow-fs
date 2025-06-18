import { router } from './_base';
import { fileRouter } from './file';

export const appRouter = router({
  file: fileRouter,
});

export type AppRouter = typeof appRouter;
