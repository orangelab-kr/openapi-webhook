import express, { Application } from 'express';
import {
  getInternalRouter,
  getRequestsRouter,
  getSettingsRouter,
  InternalError,
  InternalMiddleware,
  OPCODE,
  PlatformMiddleware,
  Wrapper,
} from '..';
import { clusterInfo } from '../tools';

export * from './internal';
export * from './requests';
export * from './settings';

export function getRouter(): Application {
  const router = express();
  InternalError.registerSentry(router);

  router.use('/internal', InternalMiddleware(), getInternalRouter());
  router.use('/settings', PlatformMiddleware(), getSettingsRouter());
  router.use('/requests', PlatformMiddleware(), getRequestsRouter());
  router.get(
    '/',
    Wrapper(async (req, res) => {
      res.json({ opcode: OPCODE.SUCCESS, ...clusterInfo });
    })
  );

  router.all(
    '*',
    Wrapper(async () => {
      throw new InternalError('Invalid API');
    })
  );

  return router;
}
