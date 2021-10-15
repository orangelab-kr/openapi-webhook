import { WrapperCallback, Request, RESULT, Wrapper } from '..';

export function RequestMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const {
      loggined: { platform },
      params: { requestId },
    } = req;

    if (typeof requestId !== 'string' || !platform) {
      throw RESULT.CANNOT_FIND_REQUEST();
    }

    const request = await Request.getRequestOrThrow(platform, requestId);
    req.request = request;
    next();
  });
}
