import { Router } from 'express';
import {
  getInternalPlatformRequestRouter,
  getInternalPlatformSettingsRouter,
} from '.';

export * from './requests';
export * from './settings';

export function getInternalPlatformRouter(): Router {
  const router = Router();

  router.use('/settings', getInternalPlatformSettingsRouter());
  router.use('/requests', getInternalPlatformRequestRouter());

  return router;
}
