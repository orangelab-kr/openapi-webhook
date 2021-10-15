import { WrapperCallback, History, RESULT, Wrapper } from '..';

export function HistoryMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const {
      request,
      params: { historyId },
    } = req;

    if (typeof historyId !== 'string' || !request) {
      throw RESULT.CANNOT_FIND_REQUEST_HISTORY();
    }

    const history = await History.getHistoryOrThrow(request, historyId);
    req.history = history;
    next();
  });
}
