import { HistoryModel, RequestModel } from '@prisma/client';
import 'express';
import {
  InternalPlatform,
  InternalPlatformAccessKey,
  InternalPlatformUser,
} from '@hikick/openapi-internal-sdk';

declare global {
  namespace Express {
    interface Request {
      permissionIds: string[];
      loggined: {
        platform: InternalPlatform;
        accessKey?: InternalPlatformAccessKey;
        user?: InternalPlatformUser;
      };
      request: RequestModel;
      history: HistoryModel;
      internal: {
        sub: string;
        iss: string;
        aud: string;
        prs: boolean[];
        iat: Date;
        exp: Date;
        platform: InternalPlatform;
        request: RequestModel;
        history: HistoryModel;
      };
    }
  }
}
