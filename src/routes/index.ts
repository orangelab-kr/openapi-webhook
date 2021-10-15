import { Router } from 'express';
import {
  clusterInfo,
  getInternalRouter,
  getRequestsRouter,
  getSettingsRouter,
  InternalMiddleware,
  RESULT,
  Wrapper,
} from '..';

export * from './internal';
export * from './requests';
export * from './settings';

export function getRouter(): Router {
  const router = Router();

  router.use('/internal', InternalMiddleware(), getInternalRouter());
  router.use('/settings', getSettingsRouter());
  router.use('/requests', getRequestsRouter());
  router.get(
    '/',
    Wrapper(async () => {
      throw RESULT.SUCCESS({ details: clusterInfo });
    })
  );

  return router;
}
