import { Callback, InternalError, Wrapper } from '..';
import { Request } from '../controllers';
import { OPCODE } from '../tools';

export function RequestMiddleware(): Callback {
  return Wrapper(async (req, res, next) => {
    const {
      accessKey,
      params: { requestId },
    } = req;

    if (typeof requestId !== 'string' || !accessKey) {
      throw new InternalError(
        '해당 요청 기록을 찾을 수 없습니다.',
        OPCODE.NOT_FOUND
      );
    }

    const request = await Request.getRequestOrThrow(
      accessKey.platform,
      requestId
    );

    req.request = request;
    next();
  });
}
