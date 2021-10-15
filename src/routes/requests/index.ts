import { Router } from 'express';
import {
  getRequestsHistoriesRouter,
  PlatformMiddleware,
  Request,
  RequestMiddleware,
  RESULT,
  Wrapper,
} from '../..';

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
    Wrapper(async (req) => {
      const { total, requests } = await Request.getRequests(
        req.query,
        req.loggined.platform
      );

      throw RESULT.SUCCESS({ details: { requests, total } });
    })
  );

  router.get(
    '/:requestId',
    PlatformMiddleware({
      permissionIds: ['webhook.requests.view'],
      final: true,
    }),
    RequestMiddleware(),
    Wrapper(async (req) => {
      const { request } = req;
      throw RESULT.SUCCESS({ details: { request } });
    })
  );

  router.get(
    '/:requestId/retry',
    PlatformMiddleware({
      permissionIds: ['webhook.requests.retry'],
      final: true,
    }),
    RequestMiddleware(),
    Wrapper(async (req) => {
      await Request.tryRequest(req.request);
      throw RESULT.SUCCESS();
    })
  );

  return router;
}
