import { RequestModel } from '@prisma/client';
import amqplib from 'amqplib';
import { logger } from '..';

export class WebhooksListener {
  public static readonly exchange = 'request';
  public static amqp?: amqplib.Connection;
  public static channel?: amqplib.Channel;

  /** RabbitMQ 연결 후 이벤트를 등록합니다. */
  public static async connect(): Promise<void> {
    if (this.amqp && this.channel) return;
    this.amqp = await amqplib.connect({
      hostname: String(process.env.WEBHOOKS_SERVICE_HOSTNAME),
      username: String(process.env.WEBHOOKS_SERVICE_USERNAME),
      password: String(process.env.WEBHOOKS_SERVICE_PASSWORD),
      vhost: String(process.env.WEBHOOKS_SERVICE_VHOST),
    });

    this.channel = await this.amqp.createChannel();
    logger.info('[RabbitMQ] 메세지큐 서버와 연결되었습니다.');
  }

  public static async sendQueue(request: RequestModel): Promise<void> {
    await this.connect();
    if (!this.amqp || !this.channel) return;
    const routingKey = `webhook/${request.webhookId}/request/${request.requestId}`;
    const content = Buffer.from(JSON.stringify(request));
    this.channel.publish(this.exchange, routingKey, content);
  }
}
