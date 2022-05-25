import { OrderState } from '../orders.schema';

export class OrderDto {
  orderKey: string;
  name: string;
  description?: string;
  state: OrderState;
  createdAt: number;
  updatedAt: number;
}

export enum PaymentStatus {
  DECLINED = 'declined',
  CONFIRMED = 'confirmed',
}
