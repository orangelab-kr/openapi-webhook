import { WebhookType } from '@prisma/client';
import { Router } from 'express';
import { OPCODE } from 'openapi-internal-sdk';
import { Webhook, Wrapper } from '../../..';

export function getInternalPlatformSettingsRouter(): Router {
  const router = Router();

  router.get(
    '/',
    Wrapper(async (req, res) => {
      const { platform } = req.internal;
      const webhooks = await Webhook.getWebhooks(platform);
      res.json({ opcode: OPCODE.SUCCESS, webhooks });
    })
  );

  router.get(
    '/:type',
    Wrapper(async (req, res) => {
      const webhook = await Webhook.getWebhook(
        req.internal.platform,
        req.params.type as WebhookType
      );

      res.json({ opcode: OPCODE.SUCCESS, webhook });
    })
  );

  router.post(
    '/:type',
    Wrapper(async (req, res) => {
      await Webhook.setWebhook(
        req.internal.platform,
        req.params.type as WebhookType,
        req.body.url as string
      );

      res.json({ opcode: OPCODE.SUCCESS });
    })
  );

  return router;
}
