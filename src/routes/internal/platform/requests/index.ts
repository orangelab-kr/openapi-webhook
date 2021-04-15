import {
  Request,
  Wrapper,
  getInternalPlatformRequestsHistoriesRouter,
} from '../../../..';

import { InternalRequestMiddleware } from '../../../../middlewares';
import { OPCODE } from 'openapi-internal-sdk';
import { Router } from 'express';

export * from './histories';

export function getInternalPlatformRequestsRouter(): Router {
  const router = Router();

  router.use(
    '/:requestId/histories',
    InternalRequestMiddleware(),
    getInternalPlatformRequestsHistoriesRouter()
  );

  router.get(
    '/',
    Wrapper(async (req, res) => {
      const { total, requests } = await Request.getRequests(
        req.query,
        req.internal.platform
      );

      res.json({ opcode: OPCODE.SUCCESS, requests, total });
    })
  );

  router.get(
    '/:requestId',
    InternalRequestMiddleware(),
    Wrapper(async (req, res) => {
      const { request } = req.internal;
      res.json({ opcode: OPCODE.SUCCESS, request });
    })
  );

  return router;
}
