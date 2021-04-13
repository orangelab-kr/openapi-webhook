import { InternalPlatformMiddleware } from '../../middlewares';
import { Router } from 'express';
import { getInternalPlatformRouter } from '../..';

export * from './platform';

export function getInternalRouter(): Router {
  const router = Router();

  router.use(
    '/platform/:platformId',
    InternalPlatformMiddleware(),
    getInternalPlatformRouter()
  );

  /*
  /:platformId/request
  /:platformId/request
  /:platformId/settings
  */
  return router;
}
