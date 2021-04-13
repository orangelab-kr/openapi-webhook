import { History } from '../../controllers/history';
import { HistoryMiddleware } from '../../middlewares';
import { OPCODE } from 'openapi-internal-sdk';
import { Router } from 'express';
import { Wrapper } from '../..';

export function getRequestsHistoriesRouter(): Router {
  const router = Router();

  router.get(
    '/',
    Wrapper(async (req, res) => {
      const { total, histories } = await History.getHistories(
        req.request,
        req.query,
        req.accessKey.platform
      );

      res.json({ opcode: OPCODE.SUCCESS, histories, total });
    })
  );

  router.get(
    '/:historyId',
    HistoryMiddleware(),
    Wrapper(async (req, res) => {
      const { history } = req;
      res.json({ opcode: OPCODE.SUCCESS, history });
    })
  );

  return router;
}
