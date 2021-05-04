import {
  Request,
  RequestMiddleware,
  Wrapper,
  getRequestsHistoriesRouter,
} from '../..';

import { OPCODE } from 'openapi-internal-sdk';
import { Router } from 'express';

export * from './histories';

export function getRequestsRouter(): Router {
  const router = Router();

  router.use(
    '/:requestId/histories',
    RequestMiddleware(),
    getRequestsHistoriesRouter()
  );

  router.get(
    '/',
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
    RequestMiddleware(),
    Wrapper(async (req, res) => {
      const { request } = req;
      res.json({ opcode: OPCODE.SUCCESS, request });
    })
  );

  return router;
}
