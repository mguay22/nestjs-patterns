import { Injectable } from '@nestjs/common';
import { Mediator } from './mediator.interface';
import { InventoryColleague } from './inventory.colleague';
import { PaymentColleague } from './payment.colleague';
import { ShippingColleague } from './shipping.colleague';
import { NotificationColleague } from './notification.colleague';

interface OrderData {
  items: { name: string; qty: number; price: number }[];
  paymentMethod: string;
  shippingAddress: Record<string, string>;
  customerEmail: string;
}

export interface EventLogEntry {
  sender: string;
  event: string;
  data: any;
  timestamp: string;
}

@Injectable()
export class OrderMediatorService implements Mediator {
  private readonly inventory: InventoryColleague;
  private readonly payment: PaymentColleague;
  private readonly shipping: ShippingColleague;
  private readonly notification: NotificationColleague;

  // Per-request event log, set during placeOrder() execution
  private currentLog: EventLogEntry[] | null = null;

  constructor() {
    this.inventory = new InventoryColleague();
    this.payment = new PaymentColleague();
    this.shipping = new ShippingColleague();
    this.notification = new NotificationColleague();

    this.inventory.setMediator(this);
    this.payment.setMediator(this);
    this.shipping.setMediator(this);
    this.notification.setMediator(this);
  }

  notify(sender: string, event: string, data?: any): any {
    if (this.currentLog) {
      this.currentLog.push({
        sender,
        event,
        data,
        timestamp: new Date().toISOString(),
      });
    }
  }

  placeOrder(orderData: OrderData) {
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const eventLog: EventLogEntry[] = [];
    this.currentLog = eventLog;

    try {
      // Step 1: Reserve inventory
      const inventoryResult = this.inventory.reserveItems(orderData.items);
      if (!inventoryResult.success) {
        return { success: false, orderId, message: 'Failed to reserve inventory', steps: eventLog };
      }

      // Step 2: Process payment
      const totalAmount = orderData.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      const paymentResult = this.payment.processPayment(orderData.paymentMethod, totalAmount);
      if (!paymentResult.success) {
        this.inventory.releaseItems(orderData.items);
        return { success: false, orderId, message: 'Payment failed', steps: eventLog };
      }

      // Step 3: Create shipment
      const shippingResult = this.shipping.createShipment(orderData.shippingAddress, orderData.items);

      // Step 4: Send notifications
      const notificationResult = this.notification.sendOrderConfirmation(
        orderData.customerEmail,
        orderId,
        shippingResult.trackingNumber,
      );

      this.notification.sendPaymentReceipt(
        orderData.customerEmail,
        paymentResult.transactionId,
        totalAmount,
      );

      return {
        success: true,
        orderId,
        totalAmount,
        transactionId: paymentResult.transactionId,
        trackingNumber: shippingResult.trackingNumber,
        estimatedDelivery: shippingResult.estimatedDelivery,
        notification: notificationResult.message,
        workflow: eventLog.map((e) => ({
          step: e.event,
          handler: e.sender,
          timestamp: e.timestamp,
        })),
      };
    } finally {
      this.currentLog = null;
    }
  }
}
