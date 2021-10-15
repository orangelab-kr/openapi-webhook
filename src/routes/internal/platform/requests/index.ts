import { Router } from 'express';
import {
  getInternalPlatformRequestsHistoriesRouter,
  InternalPermissionMiddleware,
  InternalRequestMiddleware,
  PERMISSION,
  Request,
  RESULT,
  Wrapper,
} from '../../../..';

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
    Wrapper(async (req) => {
      const { total, requests } = await Request.getRequests(
        req.query,
        req.internal.platform
      );

      throw RESULT.SUCCESS({ details: { requests, total } });
    })
  );

  router.post(
    '/',
    InternalPermissionMiddleware(PERMISSION.REQUESTS_SEND),
    Wrapper(async (req) => {
      await Request.send(req.internal.platform, req.body);
      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:requestId',
    InternalPermissionMiddleware(PERMISSION.REQUESTS_VIEW),
    InternalRequestMiddleware(),
    Wrapper(async (req) => {
      const { request } = req.internal;
      throw RESULT.SUCCESS({ details: { request } });
    })
  );

  router.get(
    '/:requestId/retry',
    InternalPermissionMiddleware(PERMISSION.REQUESTS_SEND),
    InternalRequestMiddleware(),
    Wrapper(async (req) => {
      await Request.tryRequest(req.internal.request);
      throw RESULT.SUCCESS();
    })
  );

  return router;
}
