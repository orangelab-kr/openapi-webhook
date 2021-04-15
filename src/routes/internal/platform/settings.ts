import {
  InternalPermissionMiddleware,
  PERMISSION,
  Webhook,
  Wrapper,
} from '../../..';

import { OPCODE } from 'openapi-internal-sdk';
import { Router } from 'express';
import { WebhookType } from '@prisma/client';

export function getInternalPlatformSettingsRouter(): Router {
  const router = Router();

  router.get(
    '/',
    InternalPermissionMiddleware(PERMISSION.WEBHOOKS_VIEW),
    Wrapper(async (req, res) => {
      const { platform } = req.internal;
      const webhooks = await Webhook.getWebhooks(platform);
      res.json({ opcode: OPCODE.SUCCESS, webhooks });
    })
  );

  router.get(
    '/:type',
    InternalPermissionMiddleware(PERMISSION.WEBHOOKS_VIEW),
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
    InternalPermissionMiddleware(PERMISSION.WEBHOOKS_SET),
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
