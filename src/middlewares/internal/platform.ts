import { Callback, InternalClient, Wrapper } from '../..';
import {
  InternalError,
  OPCODE,
  PlatformPermission,
} from 'openapi-internal-sdk';

export function InternalPlatformMiddleware(): Callback {
  const platformClient = InternalClient.getPlatform([
    PlatformPermission.PLATFORMS_VIEW,
  ]);

  return Wrapper(async (req, res, next) => {
    const { platformId } = req.params;
    if (typeof platformId !== 'string') {
      throw new InternalError(
        '해당 플랫폼을 찾을 수 없습니다.',
        OPCODE.NOT_FOUND
      );
    }

    const platform = await platformClient.getPlatform(platformId);
    req.internal.platform = platform;
    next();
  });
}
