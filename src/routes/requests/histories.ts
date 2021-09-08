import { History, HistoryMiddleware, PlatformMiddleware, Wrapper } from '../..';

import { OPCODE } from 'openapi-internal-sdk';
import { Router } from 'express';

export function getRequestsHistoriesRouter(): Router {
  const router = Router();

  router.get(
    '/',
    PlatformMiddleware({
      permissionIds: ['webhook.requests.histories.list'],
      final: true,
    }),
    Wrapper(async (req, res) => {
      const { total, histories } = await History.getHistories(
        req.request,
        req.query,
        req.loggined.platform
      );

      res.json({ opcode: OPCODE.SUCCESS, histories, total });
    })
  );

  router.get(
    '/:historyId',
    PlatformMiddleware({
      permissionIds: ['webhook.requests.histories.view'],
      final: true,
    }),
    HistoryMiddleware(),
    Wrapper(async (req, res) => {
      const { history } = req;
      res.json({ opcode: OPCODE.SUCCESS, history });
    })
  );

  return router;
}
