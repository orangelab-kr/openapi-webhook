import serverless from 'serverless-http';
import { Database, getRouter } from '.';

export * from './controllers';
export * from './middlewares';
export * from './routes';
export * from './tools';

Database.initPrisma();
const options = { basePath: '/v1/webhook' };
export const handler = serverless(getRouter(), options);
