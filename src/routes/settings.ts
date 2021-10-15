import { WebhookType } from '@prisma/client';
import { Router } from 'express';
import { PlatformMiddleware, RESULT, Webhook, Wrapper } from '..';

export function getSettingsRouter(): Router {
  const router = Router();

  router.get(
    '/',
    PlatformMiddleware({
      permissionIds: ['webhook.settings.list'],
      final: true,
    }),
    Wrapper(async (req) => {
      const { platform } = req.loggined;
      const webhooks = await Webhook.getWebhooks(platform);
      throw RESULT.SUCCESS({ details: { webhooks } });
    })
  );

  router.get(
    '/:type',
    PlatformMiddleware({
      permissionIds: ['webhook.settings.view'],
      final: true,
    }),
    Wrapper(async (req) => {
      const webhook = await Webhook.getWebhook(
        req.loggined.platform,
        req.params.type as WebhookType
      );

      throw RESULT.SUCCESS({ details: { webhook } });
    })
  );

  router.post(
    '/:type',
    PlatformMiddleware({
      permissionIds: ['webhook.settings.update'],
      final: true,
    }),
    Wrapper(async (req) => {
      await Webhook.setWebhook(
        req.loggined.platform,
        req.params.type as WebhookType,
        req.body.url as string
      );

      throw RESULT.SUCCESS();
    })
  );

  return router;
}
