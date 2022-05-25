import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { getUnixTimestamp } from '../shared/helper';

export type OrderDocument = Orders & Document;

export enum OrderState {
  CREATED = 'created',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  DELIVERED = 'delivered',
}

@Schema({
  timestamps: {
    currentTime: getUnixTimestamp,
  },
})
export class Orders extends Document {
  @Prop({ unique: true, required: true })
  orderKey: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  state: OrderState;

  @Prop()
  createdAt: number;

  @Prop()
  updatedAt: number;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
