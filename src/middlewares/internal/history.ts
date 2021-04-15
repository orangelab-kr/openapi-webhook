import { Callback, History, InternalError, OPCODE, Wrapper } from '../..';

export function InternalHistoryMiddleware(): Callback {
  return Wrapper(async (req, res, next) => {
    const {
      internal: { request },
      params: { historyId },
    } = req;

    if (typeof historyId !== 'string' || !request) {
      throw new InternalError(
        '해당 요청 상세 기록을 찾을 수 없습니다.',
        OPCODE.NOT_FOUND
      );
    }

    const history = await History.getHistoryOrThrow(request, historyId);
    req.internal.history = history;
    next();
  });
}
