import { HistoryModel, Prisma, RequestModel } from '@prisma/client';
import { InternalPlatform } from 'openapi-internal-sdk';
import { Joi, prisma, RESULT } from '..';

export class History {
  public static async getHistoryOrThrow(
    request: RequestModel,
    historyId: string
  ): Promise<HistoryModel> {
    const history = await History.getHistory(request, historyId);
    if (!history) throw RESULT.CANNOT_FIND_REQUEST_HISTORY();
    return history;
  }

  public static async getHistory(
    request: RequestModel,
    historyId: string
  ): Promise<HistoryModel | null> {
    const { requestId } = request;
    const history = await prisma.historyModel.findFirst({
      where: { historyId, requestId },
    });

    return history;
  }

  public static async getHistories(
    request: RequestModel,
    props: {
      take?: number;
      skip?: number;
      search?: string;
      orderByField?: 'createdAt';
      orderBySort?: 'asc' | 'desc';
    },
    platform?: InternalPlatform
  ): Promise<{ total: number; histories: HistoryModel[] }> {
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
    const { requestId } = request;
    const orderBy = { [orderByField]: orderBySort };
    const where: Prisma.HistoryModelWhereInput = {
      requestId,
      OR: [
        { historyId: search },
        { requestId: search },
        { body: { contains: search } },
      ],
    };

    if (platform) {
      const { platformId } = platform;
      where.request = { webhook: { platformId } };
    }

    const [total, histories] = await prisma.$transaction([
      prisma.historyModel.count({ where }),
      prisma.historyModel.findMany({
        take,
        skip,
        where,
        orderBy,
      }),
    ]);

    return { total, histories };
  }
}
