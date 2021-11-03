import { PlatformPermission } from 'openapi-internal-sdk';
import { InternalClient, Wrapper, WrapperCallback } from '../..';

export function InternalPlatformMiddleware(): WrapperCallback {
  const platformClient = InternalClient.getPlatform([
    PlatformPermission.PLATFORM_VIEW,
  ]);

  return Wrapper(async (req, res, next) => {
    const { platformId } = req.params;
    const platform = await platformClient.getPlatform(platformId);
    req.internal.platform = platform;
    next();
  });
}
