import { WebhookModel, WebhookType } from '@prisma/client';
import { InternalPlatform } from 'openapi-internal-sdk';
import { Joi, prisma } from '..';

export class Webhook {
  public static async getWebhooks(
    platform: InternalPlatform
  ): Promise<{ type: WebhookType; url: string | null }[]> {
    const { platformId } = platform;
    const webhooks = await prisma.webhookModel.findMany({
      where: { platformId },
    });

    return Object.values(WebhookType).map((type) => {
      const webhook = webhooks.find((w) => w.type === type) || null;
      const url = webhook && webhook.url;
      return { type, url };
    });
  }

  public static async getWebhook(
    platform: InternalPlatform,
    type: WebhookType
  ): Promise<{ type: WebhookType; url: string | null }> {
    type = await Joi.string()
      .valid(...Object.keys(WebhookType))
      .validateAsync(type);

    const { platformId } = platform;
    const webhook = await prisma.webhookModel.findFirst({
      where: { platformId, type },
    });

    const url = webhook && webhook.url;
    return { type, url };
  }

  public static async getWebhookDoc(
    platform: InternalPlatform,
    type: WebhookType
  ): Promise<WebhookModel | null> {
    type = await Joi.string()
      .valid(...Object.keys(WebhookType))
      .validateAsync(type);

    const { platformId } = platform;
    const webhook = await prisma.webhookModel.findFirst({
      where: { platformId, type },
    });

    return webhook;
  }

  public static async setWebhook(
    platform: InternalPlatform,
    type: WebhookType,
    url: string | null
  ): Promise<void> {
    const { platformId } = platform;
    url = await Joi.string().uri().allow('').optional().validateAsync(url);
    if (!url) return Webhook.deleteWebhook(platform, type);
    const webhook = await prisma.webhookModel.findFirst({
      where: { platformId, type },
    });

    if (webhook) {
      const { webhookId } = webhook;
      await prisma.webhookModel.update({
        where: { webhookId },
        data: { url },
      });

      return;
    }

    await prisma.webhookModel.create({
      data: { platformId, type, url },
    });
  }

  public static async deleteWebhook(
    platform: InternalPlatform,
    type: WebhookType
  ): Promise<void> {
    const { platformId } = platform;
    await prisma.webhookModel.deleteMany({
      where: { platformId, type },
    });
  }
}
