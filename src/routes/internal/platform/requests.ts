import { WebhookType } from '@prisma/client';
import { Router } from 'express';
import { OPCODE } from 'openapi-internal-sdk';
import { Requests, Webhook, Wrapper } from '../../..';

export function getInternalPlatformRequestRouter(): Router {
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
    '/',
    Wrapper(async (req, res) => {
      const { internal, body } = req;
      await Requests.send(internal.platform, body);
      res.json({ opcode: OPCODE.SUCCESS });
    })
  );

  return router;
}
