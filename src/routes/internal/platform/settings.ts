import { WebhookType } from '@prisma/client';
import { Router } from 'express';
import {
  InternalPermissionMiddleware,
  PERMISSION,
  RESULT,
  Webhook,
  Wrapper,
} from '../../..';

export function getInternalPlatformSettingsRouter(): Router {
  const router = Router();

  router.get(
    '/',
    InternalPermissionMiddleware(PERMISSION.WEBHOOKS_VIEW),
    Wrapper(async (req) => {
      const { platform } = req.internal;
      const webhooks = await Webhook.getWebhooks(platform);
      throw RESULT.SUCCESS({ details: { webhooks } });
    })
  );

  router.get(
    '/:type',
    InternalPermissionMiddleware(PERMISSION.WEBHOOKS_VIEW),
    Wrapper(async (req) => {
      const webhook = await Webhook.getWebhook(
        req.internal.platform,
        req.params.type as WebhookType
      );

      throw RESULT.SUCCESS({ details: { webhook } });
    })
  );

  router.post(
    '/:type',
    InternalPermissionMiddleware(PERMISSION.WEBHOOKS_SET),
    Wrapper(async (req) => {
      await Webhook.setWebhook(
        req.internal.platform,
        req.params.type as WebhookType,
        req.body.url as string
      );

      throw RESULT.SUCCESS();
    })
  );

  return router;
}
