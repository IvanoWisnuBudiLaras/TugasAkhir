import { PubSub } from 'graphql-subscriptions';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderSubscriptionService {
  private pubSub = new PubSub();

  async publishOrderUpdate(order: any) {
    await this.pubSub.publish('orderUpdated', { orderUpdated: order });
  }

  async publishOrderCreated(order: any) {
    await this.pubSub.publish('orderCreated', { orderCreated: order });
  }

  getPubSub() {
    return this.pubSub;
  }
}