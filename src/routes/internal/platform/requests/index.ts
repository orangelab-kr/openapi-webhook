import {
  InternalPermissionMiddleware,
  PERMISSION,
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
    InternalPermissionMiddleware(PERMISSION.REQUESTS_LIST),
    Wrapper(async (req, res) => {
      const { total, requests } = await Request.getRequests(
        req.query,
        req.internal.platform
      );

      res.json({ opcode: OPCODE.SUCCESS, requests, total });
    })
  );

  router.post(
    '/',
    InternalPermissionMiddleware(PERMISSION.REQUESTS_SEND),
    Wrapper(async (req, res) => {
      await Request.send(req.internal.platform, req.body);
      res.json({ opcode: OPCODE.SUCCESS });
    })
  );

  router.get(
    '/:requestId',
    InternalPermissionMiddleware(PERMISSION.REQUESTS_VIEW),
    InternalRequestMiddleware(),
    Wrapper(async (req, res) => {
      const { request } = req.internal;
      res.json({ opcode: OPCODE.SUCCESS, request });
    })
  );

  router.get(
    '/:requestId/retry',
    InternalPermissionMiddleware(PERMISSION.REQUESTS_SEND),
    InternalRequestMiddleware(),
    Wrapper(async (req, res) => {
      await Request.tryRequest(req.internal.request);
      res.json({ opcode: OPCODE.SUCCESS });
    })
  );

  return router;
}
