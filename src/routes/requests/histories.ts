import { Router } from 'express';
import {
  History,
  HistoryMiddleware,
  PlatformMiddleware,
  RESULT,
  Wrapper,
} from '../..';

export function getRequestsHistoriesRouter(): Router {
  const router = Router();

  router.get(
    '/',
    PlatformMiddleware({
      permissionIds: ['webhook.requests.histories.list'],
      final: true,
    }),
    Wrapper(async (req) => {
      const { total, histories } = await History.getHistories(
        req.request,
        req.query,
        req.loggined.platform
      );

      throw RESULT.SUCCESS({ details: { histories, total } });
    })
  );

  router.get(
    '/:historyId',
    PlatformMiddleware({
      permissionIds: ['webhook.requests.histories.view'],
      final: true,
    }),
    HistoryMiddleware(),
    Wrapper(async (req) => {
      const { history } = req;
      throw RESULT.SUCCESS({ details: { history } });
    })
  );

  return router;
}
