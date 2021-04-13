import { HistoryModel, Prisma, RequestModel } from '@prisma/client';
import { InternalError, Joi, OPCODE } from '..';

import { Database } from '../tools';
import { InternalPlatform } from 'openapi-internal-sdk';

const { prisma } = Database;

export class History {
  public static async getHistoryOrThrow(
    request: RequestModel,
    historyId: string
  ): Promise<HistoryModel> {
    const history = await History.getHistory(request, historyId);
    if (!history) {
      throw new InternalError(
        '해당 요청 상세 기록을 찾을 수 없습니다.',
        OPCODE.NOT_FOUND
      );
    }

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

    const {
      take,
      skip,
      search,
      orderByField,
      orderBySort,
    } = await schema.validateAsync(props);
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

    const [total, history] = await prisma.$transaction([
      prisma.historyModel.count({ where }),
      prisma.historyModel.findMany({
        take,
        skip,
        where,
        orderBy,
      }),
    ]);

    return { total, history };
  }
}
