import { Colleague } from './colleague.interface';

export class ShippingColleague extends Colleague {
  getName(): string {
    return 'Shipping';
  }

  createShipment(address: Record<string, string>, items: { name: string; qty: number }[]): {
    success: boolean;
    trackingNumber: string;
    estimatedDelivery: string;
    message: string;
  } {
    const trackingNumber = `SHIP_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const result = {
      success: true,
      trackingNumber,
      estimatedDelivery: deliveryDate.toISOString().split('T')[0],
      message: `Shipment created for ${items.length} item(s) to ${address.city}, ${address.country}`,
    };

    this.mediator.notify(this.getName(), 'shipping.created', result);

    return result;
  }
}
