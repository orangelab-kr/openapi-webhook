import { Router } from 'express';
import { OPCODE } from 'openapi-internal-sdk';
import { getRequestsHistoriesRouter, RequestMiddleware, Wrapper } from '../..';
import { Request } from '../../controllers';

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
        req.accessKey.platform
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
