import { WrapperCallback, RESULT, Wrapper } from '../..';

export enum PERMISSION {
  WEBHOOKS_SET,
  WEBHOOKS_VIEW,

  REQUESTS_SEND,
  REQUESTS_LIST,
  REQUESTS_VIEW,

  HISTORIES_LIST,
  HISTORIES_VIEW,
}

export function InternalPermissionMiddleware(
  permission: PERMISSION
): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    if (!req.internal.prs[permission]) {
      throw RESULT.PERMISSION_DENIED({ args: [PERMISSION[permission]] });
    }

    await next();
  });
}
