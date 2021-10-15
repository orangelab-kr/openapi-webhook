import { Router } from 'express';
import {
  History,
  InternalHistoryMiddleware,
  InternalPermissionMiddleware,
  PERMISSION,
  RESULT,
  Wrapper,
} from '../../../..';

export function getInternalPlatformRequestsHistoriesRouter(): Router {
  const router = Router();

  router.get(
    '/',
    InternalPermissionMiddleware(PERMISSION.HISTORIES_LIST),
    Wrapper(async (req) => {
      const { total, histories } = await History.getHistories(
        req.internal.request,
        req.query,
        req.internal.platform
      );

      throw RESULT.SUCCESS({ details: { histories, total } });
    })
  );

  router.get(
    '/:historyId',
    InternalPermissionMiddleware(PERMISSION.HISTORIES_VIEW),
    InternalHistoryMiddleware(),
    Wrapper(async (req) => {
      const { history } = req.internal;
      throw RESULT.SUCCESS({ details: { history } });
    })
  );

  return router;
}
