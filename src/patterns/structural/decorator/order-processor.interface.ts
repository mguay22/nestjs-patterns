export interface OrderItem {
  name: string;
  price: number;
}

export interface OrderData {
  items: OrderItem[];
}

export interface ProcessedOrder {
  orderId: string;
  steps: string[];
  total: number;
  timestamp: string;
}

export interface OrderProcessor {
  process(order: OrderData): ProcessedOrder;
}
