import { Request, RESULT, Wrapper, WrapperCallback } from '../..';

export function InternalRequestMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const {
      internal: { platform },
      params: { requestId },
    } = req;

    if (typeof requestId !== 'string' || !platform) {
      throw RESULT.CANNOT_FIND_REQUEST();
    }

    const request = await Request.getRequestOrThrow(platform, requestId);
    req.internal.request = request;
    next();
  });
}
