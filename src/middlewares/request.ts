import { Callback, InternalError, Wrapper } from '..';

import { OPCODE } from '../tools';
import { Requests } from '../controllers';

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

    const request = await Requests.getRequestOrThrow(
      accessKey.platform,
      requestId
    );

    req.request = request;
    next();
  });
}
