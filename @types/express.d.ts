import { HistoryModel, RequestModel } from '.prisma/client';
import 'express';
import {
  InternalPlatform,
  InternalPlatformAccessKey,
} from 'openapi-internal-sdk';

declare global {
  namespace Express {
    interface Request {
      accessKey: InternalPlatformAccessKey;
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
      };
    }
  }
}
