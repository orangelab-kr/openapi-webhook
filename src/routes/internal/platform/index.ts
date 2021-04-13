import {
  getInternalPlatformRequestRouter,
  getInternalPlatformSettingsRouter,
} from '.';

import { Router } from 'express';

export * from './requests';
export * from './settings';

export function getInternalPlatformRouter(): Router {
  const router = Router();

  router.use('/settings', getInternalPlatformSettingsRouter());
  router.use('/request', getInternalPlatformRequestRouter());

  return router;
}
