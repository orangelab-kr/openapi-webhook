import { WrapperCallback, History, RESULT, Wrapper } from '../..';

export function InternalHistoryMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const {
      internal: { request },
      params: { historyId },
    } = req;

    if (typeof historyId !== 'string' || !request) {
      throw RESULT.CANNOT_FIND_REQUEST_HISTORY();
    }

    const history = await History.getHistoryOrThrow(request, historyId);
    req.internal.history = history;
    next();
  });
}
