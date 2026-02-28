import { Injectable } from '@nestjs/common';

export interface ShipmentResult {
  shipmentId: string;
  estimatedDelivery: string;
  carrier: string;
}

@Injectable()
export class ShippingService {
  createShipment(
    items: { name: string; quantity: number }[],
    address: string,
  ): ShipmentResult {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    return {
      shipmentId: `SHIP-${Date.now()}`,
      estimatedDelivery: deliveryDate.toISOString().split('T')[0]!,
      carrier: 'FedEx',
    };
  }
}
