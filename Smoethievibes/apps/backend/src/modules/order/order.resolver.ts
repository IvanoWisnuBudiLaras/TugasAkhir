import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.model';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { OrderResponse, OrderItemResponse } from './dto/order-response.type';
import { OrderSubscriptionService } from './order-subscription.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly subscriptionService: OrderSubscriptionService
  ) {}

  // --- MUTATIONS ---

  @Mutation(() => OrderResponse)
  async createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    try {
      const order = await this.orderService.create(createOrderInput);
      return {
        success: true,
        message: 'Order berhasil dibuat',
        order
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan sistem';
      return {
        success: false,
        message: errorMessage,
        order: null
      };
    }
  }

  @Mutation(() => OrderResponse)
  async updateOrderStatus(@Args('id') id: string, @Args('status') status: string) {
    try {
      const order = await this.orderService.updateStatus(id, status);
      return {
        success: true,
        message: 'Status order berhasil diupdate',
        order
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan sistem';
      return {
        success: false,
        message: errorMessage,
        order: null
      };
    }
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

  // --- QUERIES ---

  @Query(() => [Order], { name: 'orders' })
  async findAll() {
    return this.orderService.findAll();
  }

  @Query(() => Order, { name: 'order' })
  async findOne(@Args('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Query(() => [Order], { name: 'ordersByUser' })
  async findByUser(@Args('userId') userId: string) {
    return this.orderService.findByUser(userId);
  }

  // --- SUBSCRIPTIONS ---

  @Subscription(() => Order, {
    name: 'orderCreated',
    resolve: (payload) => payload.orderCreated, // Penting agar data terbaca benar
  })
  orderCreated() {
    return this.subscriptionService.getPubSub().asyncIterableIterator('orderCreated');
  }

  @Subscription(() => Order, {
    name: 'orderUpdated',
    resolve: (payload) => payload.orderUpdated,
  })
  orderUpdated() {
    return this.subscriptionService.getPubSub().asyncIterableIterator('orderUpdated');
  }

  // --- CATATAN PENTING ---
  // Fungsi addOrUpdateOrderItem dan removeOrderItem sementara saya hapus 
  // karena di OrderService yang kita perbaiki tadi tidak ada fungsi manual per item.
  // Order biasanya dibuat sekaligus (Bulk) lewat createOrder.
}