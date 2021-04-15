import { History, Wrapper } from '../../../..';
import {
  InternalHistoryMiddleware,
  InternalPermissionMiddleware,
  PERMISSION,
} from '../../../../middlewares';

import { OPCODE } from 'openapi-internal-sdk';
import { Router } from 'express';

export function getInternalPlatformRequestsHistoriesRouter(): Router {
  const router = Router();

  router.get(
    '/',
    InternalPermissionMiddleware(PERMISSION.HISTORIES_LIST),
    Wrapper(async (req, res) => {
      const { total, histories } = await History.getHistories(
        req.internal.request,
        req.query,
        req.internal.platform
      );

      res.json({ opcode: OPCODE.SUCCESS, histories, total });
    })
  );

  router.get(
    '/:historyId',
    InternalPermissionMiddleware(PERMISSION.HISTORIES_VIEW),
    InternalHistoryMiddleware(),
    Wrapper(async (req, res) => {
      const { history } = req.internal;
      res.json({ opcode: OPCODE.SUCCESS, history });
    })
  );

  return router;
}
