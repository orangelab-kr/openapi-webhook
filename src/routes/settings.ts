import { Webhooks, Wrapper } from '..';

import { OPCODE } from 'openapi-internal-sdk';
import { Router } from 'express';
import { WebhookType } from '@prisma/client';

export function getSettingsRouter(): Router {
  const router = Router();

  router.get(
    '/',
    Wrapper(async (req, res) => {
      const { platform } = req.accessKey;
      const webhooks = await Webhooks.getWebhooks(platform);
      res.json({ opcode: OPCODE.SUCCESS, webhooks });
    })
  );

  router.get(
    '/:type',
    Wrapper(async (req, res) => {
      const webhook = await Webhooks.getWebhook(
        req.accessKey.platform,
        req.params.type as WebhookType
      );

      res.json({ opcode: OPCODE.SUCCESS, webhook });
    })
  );

  router.post(
    '/:type',
    Wrapper(async (req, res) => {
      await Webhooks.setWebhook(
        req.accessKey.platform,
        req.params.type as WebhookType,
        req.body.url as string
      );

      res.json({ opcode: OPCODE.SUCCESS });
    })
  );

  return router;
}
