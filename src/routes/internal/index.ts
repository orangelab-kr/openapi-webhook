import { Router } from 'express';
import { getInternalPlatformRouter, InternalPlatformMiddleware } from '../..';

export * from './platform';

export function getInternalRouter(): Router {
  const router = Router();

  router.use(
    '/platform/:platformId',
    InternalPlatformMiddleware(),
    getInternalPlatformRouter()
  );

  return router;
}
