import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { AddOrderItemInput } from './dto/order-item.input';
import { OrderResponse, OrderItemResponse } from './dto/order-response.type';
import { OrderSubscriptionService } from './order-subscription.service';
@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly subscriptionService: OrderSubscriptionService
  ) {}

  @Mutation(() => OrderResponse)
  async createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    try {
      const order = await this.orderService.create(createOrderInput);
      return {
        success: true,
        message: 'Order berhasil dibuat',
        order
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        order: null
      };
    }
  }

  @Subscription(() => Order)
  orderCreated() {
    return this.subscriptionService.getPubSub().asyncIterableIterator('orderCreated');
  }

  @Subscription(() => Order)
  orderUpdated() {
    return this.subscriptionService.getPubSub().asyncIterableIterator('orderUpdated');
  }

  @Mutation(() => OrderItemResponse)
  async addOrUpdateOrderItem(@Args('input') input: AddOrderItemInput) {
    try {
      await this.orderService.addOrUpdateOrderItem(input.orderId, input.productId, input.quantity);
      return {
        success: true,
        message: 'Produk berhasil ditambahkan/diupdate',
        orderId: input.orderId
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        orderId: null
      };
    }
  }

  @Mutation(() => OrderResponse)
  async removeOrderItem(@Args('orderId') orderId: string, @Args('orderItemId') orderItemId: string) {
    try {
      const order = await this.orderService.removeOrderItem(orderId, orderItemId);
      return {
        success: true,
        message: 'Produk berhasil dihapus dari order',
        order
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        order: null
      };
    }
  }

  @Mutation(() => OrderResponse)
  async updateOrderStatus(@Args('id') id: string, @Args('status') status: string) {
    try {
      const order = await this.orderService.update(id, { status });
      return {
        success: true,
        message: 'Status order berhasil diupdate',
        order
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
        order: null
      };
    }
  }

  @Query(() => [Order], { name: 'orders' })
  async findAll() {
    return this.orderService.findAll();
  }

  @Query(() => Order, { name: 'order' })
  async findOne(@Args('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Mutation(() => Order)
  async updateOrder(
    @Args('id') id: string,
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
  ) {
    return this.orderService.update(id, updateOrderInput);
  }

  @Mutation(() => Order)
  async deleteOrder(@Args('id') id: string) {
    return this.orderService.remove(id);
  }

  // Additional queries
  @Query(() => [Order], { name: 'ordersByUser' })
  async findByUser(@Args('userId') userId: string) {
    return this.orderService.findByUser(userId);
  }


}