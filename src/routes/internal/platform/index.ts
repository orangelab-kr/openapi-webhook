import {
  getInternalPlatformRequestsRouter,
  getInternalPlatformSettingsRouter,
} from '.';

import { Router } from 'express';

export * from './requests';
export * from './settings';

export function getInternalPlatformRouter(): Router {
  const router = Router();

  router.use('/settings', getInternalPlatformSettingsRouter());
  router.use('/requests', getInternalPlatformRequestsRouter());

  return router;
}
