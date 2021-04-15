import { Callback, InternalError, OPCODE, Wrapper } from '../..';

export enum PERMISSION {
  WEBHOOKS_SET,
  WEBHOOKS_VIEW,

  REQUESTS_SEND,
  REQUESTS_LIST,
  REQUESTS_VIEW,

  HISTORIES_LIST,
  HISTORIES_VIEW,
}

export function InternalPermissionMiddleware(permission: PERMISSION): Callback {
  return Wrapper(async (req, res, next) => {
    if (!req.internal.prs[permission]) {
      throw new InternalError(
        `${PERMISSION[permission]} 권한이 없습니다.`,
        OPCODE.ACCESS_DENIED
      );
    }

    await next();
  });
}
