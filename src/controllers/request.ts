import {
  Prisma,
  RequestModel,
  WebhookModel,
  WebhookType,
} from '@prisma/client';
import { InternalPlatform, OPCODE } from 'openapi-internal-sdk';
import { InternalError, Joi, Listener, logger, prisma, Webhook } from '..';

export class Request {
  public static requestInclude: Prisma.RequestModelInclude = { webhook: true };

  public static async send(
    platform: InternalPlatform,
    props: { type: WebhookType; data: any }
  ): Promise<void> {
    const schema = Joi.object({
      type: Joi.string()
        .valid(...Object.keys(WebhookType))
        .required(),
      data: Joi.object().default({}).optional(),
    });

    const { type, data } = await schema.validateAsync(props);
    const webhook = await Webhook.getWebhookDoc(platform, type);
    if (!webhook) return;

    const request = await this.createRequest(webhook, data);
    await Request.tryRequest(request);
  }

  public static async createRequest(
    webhook: WebhookModel,
    data: any
  ): Promise<RequestModel> {
    const { webhookId } = webhook;
    const request = await prisma.requestModel.create({
      data: { webhookId, data: JSON.stringify(data) },
      include: this.requestInclude,
    });

    return request;
  }

  public static async tryRequest(
    request: RequestModel & { webhook?: WebhookModel }
  ): Promise<void> {
    if (request.completedAt || !request.webhook) {
      throw new InternalError('이미 처리된 요청입니다.', OPCODE.ALREADY_EXISTS);
    }

    logger.info(
      `${request.requestId}(${request.webhook.url}) - 요청을 시도하는 중입니다.`
    );

    await Listener.sendQueue(request);
  }

  public static async getRequestOrThrow(
    platform: InternalPlatform,
    requestId: string
  ): Promise<RequestModel> {
    const request = await Request.getRequest(platform, requestId);
    if (!request) {
      throw new InternalError(
        '해당 요청 기록을 찾을 수 없습니다.',
        OPCODE.NOT_FOUND
      );
    }

    return request;
  }

  public static async getRequest(
    platform: InternalPlatform,
    requestId: string
  ): Promise<RequestModel | null> {
    const { platformId } = platform;
    const request = await prisma.requestModel.findFirst({
      where: { requestId, webhook: { platformId } },
      include: this.requestInclude,
    });

    return request;
  }

  public static async getRequests(
    props: {
      take?: number;
      skip?: number;
      search?: string;
      orderByField?: 'createdAt';
      orderBySort?: 'asc' | 'desc';
    },
    platform?: InternalPlatform
  ): Promise<{ total: number; requests: RequestModel[] }> {
    const schema = Joi.object({
      take: Joi.number().default(10).optional(),
      skip: Joi.number().default(0).optional(),
      search: Joi.string().default('').allow('').optional(),
      orderByField: Joi.string()
        .default('createdAt')
        .valid('createdAt')
        .optional(),
      orderBySort: Joi.string().default('desc').valid('asc', 'desc').optional(),
    });

    const { take, skip, search, orderByField, orderBySort } =
      await schema.validateAsync(props);
    const orderBy = { [orderByField]: orderBySort };
    const include: Prisma.RequestModelInclude = { webhook: true };
    const where: Prisma.RequestModelWhereInput = {
      OR: [
        { requestId: search },
        { webhook: { platformId: search } },
        { data: { contains: search } },
      ],
    };

    if (platform) {
      const { platformId } = platform;
      where.webhook = { platformId };
    }

    const [total, requests] = await prisma.$transaction([
      prisma.requestModel.count({ where }),
      prisma.requestModel.findMany({
        take,
        skip,
        where,
        orderBy,
        include,
      }),
    ]);

    return { total, requests };
  }
}
