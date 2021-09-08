import { PlatformMiddleware, Webhook, Wrapper } from '..';

import { OPCODE } from 'openapi-internal-sdk';
import { Router } from 'express';
import { WebhookType } from '@prisma/client';

export function getSettingsRouter(): Router {
  const router = Router();

  router.get(
    '/',
    PlatformMiddleware({
      permissionIds: ['webhook.settings.list'],
      final: true,
    }),
    Wrapper(async (req, res) => {
      const { platform } = req.loggined;
      const webhooks = await Webhook.getWebhooks(platform);
      res.json({ opcode: OPCODE.SUCCESS, webhooks });
    })
  );

  router.get(
    '/:type',
    PlatformMiddleware({
      permissionIds: ['webhook.settings.view'],
      final: true,
    }),
    Wrapper(async (req, res) => {
      const webhook = await Webhook.getWebhook(
        req.loggined.platform,
        req.params.type as WebhookType
      );

      res.json({ opcode: OPCODE.SUCCESS, webhook });
    })
  );

  router.post(
    '/:type',
    PlatformMiddleware({
      permissionIds: ['webhook.settings.update'],
      final: true,
    }),
    Wrapper(async (req, res) => {
      await Webhook.setWebhook(
        req.loggined.platform,
        req.params.type as WebhookType,
        req.body.url as string
      );

      res.json({ opcode: OPCODE.SUCCESS });
    })
  );

  return router;
}
