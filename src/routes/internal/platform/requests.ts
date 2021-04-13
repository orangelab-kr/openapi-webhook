import { Requests, Webhooks, Wrapper } from '../../..';

import { OPCODE } from 'openapi-internal-sdk';
import { Router } from 'express';
import { WebhookType } from '@prisma/client';

export function getInternalPlatformRequestRouter(): Router {
  const router = Router();

  router.get(
    '/',
    Wrapper(async (req, res) => {
      const { platform } = req.internal;
      const webhooks = await Webhooks.getWebhooks(platform);
      res.json({ opcode: OPCODE.SUCCESS, webhooks });
    })
  );

  router.get(
    '/:type',
    Wrapper(async (req, res) => {
      const webhook = await Webhooks.getWebhook(
        req.internal.platform,
        req.params.type as WebhookType
      );

      res.json({ opcode: OPCODE.SUCCESS, webhook });
    })
  );

  router.post(
    '/',
    Wrapper(async (req, res) => {
      const { internal, body } = req;
      await Requests.send(internal.platform, body);
      res.json({ opcode: OPCODE.SUCCESS });
    })
  );

  return router;
}
