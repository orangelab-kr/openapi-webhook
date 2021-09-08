import {
  Request,
  RequestMiddleware,
  Wrapper,
  getRequestsHistoriesRouter,
  PlatformMiddleware,
} from '../..';

import { OPCODE } from 'openapi-internal-sdk';
import { Router } from 'express';

export * from './histories';

export function getRequestsRouter(): Router {
  const router = Router();

  router.use(
    '/:requestId/histories',
    PlatformMiddleware({
      permissionIds: ['webhook.requests.view'],
      final: true,
    }),
    RequestMiddleware(),
    getRequestsHistoriesRouter()
  );

  router.get(
    '/',
    PlatformMiddleware({
      permissionIds: ['webhook.requests.list'],
      final: true,
    }),
    Wrapper(async (req, res) => {
      const { total, requests } = await Request.getRequests(
        req.query,
        req.loggined.platform
      );

      res.json({ opcode: OPCODE.SUCCESS, requests, total });
    })
  );

  router.get(
    '/:requestId',
    PlatformMiddleware({
      permissionIds: ['webhook.requests.view'],
      final: true,
    }),
    RequestMiddleware(),
    Wrapper(async (req, res) => {
      const { request } = req;
      res.json({ opcode: OPCODE.SUCCESS, request });
    })
  );

  router.get(
    '/:requestId/retry',
    PlatformMiddleware({
      permissionIds: ['webhook.requests.retry'],
      final: true,
    }),
    RequestMiddleware(),
    Wrapper(async (req, res) => {
      await Request.tryRequest(req.request);
      res.json({ opcode: OPCODE.SUCCESS });
    })
  );

  return router;
}
