import { Injectable, BadRequestException } from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import { PaymentService } from './payment.service.js';
import { ShippingService } from './shipping.service.js';
import { NotificationService } from './notification.service.js';

export interface PlaceOrderData {
  items: { name: string; quantity: number; price: number }[];
  shippingAddress: string;
  paymentMethod: string;
  customerEmail: string;
}

@Injectable()
export class OrderFacadeService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly paymentService: PaymentService,
    private readonly shippingService: ShippingService,
    private readonly notificationService: NotificationService,
  ) {}

  placeOrder(orderData: PlaceOrderData) {
    // Step 1: Check inventory
    const stockResult = this.inventoryService.checkStock(orderData.items);
    if (!stockResult.available) {
      throw new BadRequestException(
        `Items out of stock: ${stockResult.unavailableItems.join(', ')}`,
      );
    }

    // Step 2: Process payment
    const totalAmount = orderData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const paymentResult = this.paymentService.processPayment(
      totalAmount,
      orderData.paymentMethod,
    );
    if (!paymentResult.success) {
      throw new BadRequestException('Payment processing failed');
    }

    // Step 3: Create shipment
    const shipmentResult = this.shippingService.createShipment(
      orderData.items,
      orderData.shippingAddress,
    );

    // Step 4: Send confirmation
    const orderId = `ORD-${Date.now()}`;
    const notificationResult = this.notificationService.sendConfirmation(
      orderData.customerEmail,
      { orderId, total: totalAmount },
    );

    return {
      orderId,
      status: 'confirmed',
      inventory: stockResult,
      payment: paymentResult,
      shipping: shipmentResult,
      notification: notificationResult,
      total: parseFloat(totalAmount.toFixed(2)),
    };
  }
}
